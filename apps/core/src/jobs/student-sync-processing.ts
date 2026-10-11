import { createHash } from 'node:crypto';

import { defineJob } from '@next/queues/client';
import { currentQuad, findQuarter } from '@next/utils';
import { z } from 'zod';

import { JOB_NAMES } from '@/constants.js';
import {
  AcademicPendingEventModel,
  AcademicSyncOperationModel,
} from '@/models/AcademicIdentity.js';
import { GraduationHistoryModel } from '@/models/GraduationHistory.js';
import { HistoryModel } from '@/models/History.js';
import { StudentModel } from '@/models/Student.js';
import {
  applyVerifiedAcademicSync,
  proofMatches,
} from '@/services/academic-identity.js';

import {
  StudentFailedEventSchema,
  StudentSyncedEventSchema,
} from '../schemas/v2/webhook/ufabc-parser.js';

export const studentSyncJobSchema = z.object({
  deliveryId: z.string().uuid(),
  event: z.enum(['student.synced', 'student.failed']),
  timestamp: z.string(),
  data: z.union([
    StudentSyncedEventSchema.shape.data,
    StudentFailedEventSchema.shape.data,
  ]),
});

export async function processStudentSync(
  app: any,
  input: z.infer<typeof studentSyncJobSchema>
) {
  const { deliveryId, event, data } = input;
  const quarantine = async (reason: string) => {
    await AcademicPendingEventModel.updateOne(
      { deliveryId },
      { $setOnInsert: { reason, payload: input } },
      { upsert: true }
    );
    return { success: false, status: 'pending_identity', reason };
  };
  if (!data.operationId || !data.verifiedSession)
    return quarantine('missing_session_proof');
  if (data.ra !== data.verifiedSession.ra) return quarantine('ra_mismatch');
  if (event === 'student.failed') {
    const operation = await AcademicSyncOperationModel.findOne({
      operationId: data.operationId,
    });
    if (!operation || !proofMatches(operation, data.verifiedSession))
      return quarantine('session_identity_mismatch');
    await AcademicSyncOperationModel.updateOne(
      { _id: operation._id, status: 'awaiting' },
      { $set: { status: 'failed' } }
    );
    return { success: false, status: 'failed' };
  }
  const parsed = StudentSyncedEventSchema.shape.data.safeParse(data);
  if (!parsed.success) return quarantine('invalid_student_event');
  const payload = parsed.data;
  if (payload.student.ra !== payload.ra)
    return quarantine('student_ra_mismatch');
  const payloadHash = createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex');
  const result = await applyVerifiedAcademicSync(
    data.operationId,
    data.verifiedSession,
    payloadHash,
    async (ownership, session) => {
      const { student, coefficients, components } = payload;
      const season = currentQuad();
      const course = student.course.toLowerCase();
      const grade = payload.graduations.grade ?? '';
      const historyKey = JSON.stringify([course, grade]);
      const previousStudent = await StudentModel.findOne({
        academicBindingId: ownership.academicBindingId,
        recordKey: season,
      })
        .session(session)
        .lean();
      await StudentModel.updateOne(
        { academicBindingId: ownership.academicBindingId, recordKey: season },
        {
          $set: {
            ...ownership,
            ra: Number(payload.ra),
            season,
            recordKey: season,
            active: true,
            login: data.verifiedSession!.login.trim().toLowerCase(),
            cursos: [
              ...(previousStudent?.cursos ?? []).filter(
                (existing) => existing.nome_curso !== student.course
              ),
              {
                id_curso: previousStudent?.cursos.find(
                  (existing) => existing.nome_curso === student.course
                )?.id_curso,
                nome_curso: student.course,
                turno: student.shift === 'n' ? 'n' : 'm',
                ind_afinidade: coefficients.ik,
                cp: coefficients.cp,
                ca: coefficients.ca,
                cr: coefficients.cr,
              },
            ],
          },
        },
        { upsert: true, session }
      );
      const { year, quad } = findQuarter();
      const update = {
        ...ownership,
        ra: Number(payload.ra),
        active: true,
        recordKey: historyKey,
        curso: course,
        grade,
        disciplinas: components.map((component) => ({
          periodo: component.period,
          codigo: component.UFCode,
          disciplina: component.name,
          ano: Number(component.year),
          situacao: component.status,
          creditos: component.credits,
          categoria: {
            free: 'Livre Escolha',
            mandatory: 'Obrigatória',
            limited: 'Opção Limitada',
          }[component.category],
          conceito: component.grade,
          turma: component.class ?? '',
          teachers: component.teachers ?? [],
        })),
        ['coefficients.' + year + '.' + quad]: {
          ca_quad: coefficients.ca,
          ca_acumulado: coefficients.ca,
          cr_quad: coefficients.cr,
          cr_acumulado: coefficients.cr,
          cp_acumulado: coefficients.cp,
          percentage_approved: 0,
          accumulated_credits: 0,
          period_credits: 0,
        },
      };
      const filter = {
        academicBindingId: ownership.academicBindingId,
        recordKey: historyKey,
      };
      await HistoryModel.updateOne(
        filter,
        { $set: update },
        { upsert: true, session }
      );
      await GraduationHistoryModel.updateOne(
        filter,
        { $set: update },
        { upsert: true, session }
      );
    }
  );
  if (
    result?.status !== 'applied' ||
    !('operation' in result) ||
    !result.operation
  ) {
    return quarantine(
      result && 'reason' in result
        ? (result.reason ?? 'identity_conflict')
        : 'identity_conflict'
    );
  }
  // Dispatch after commit. A queue retry replays this dispatch, while writes are idempotent.
  await app.manager.dispatch(JOB_NAMES.PROCESS_COMPONENTS_ENROLLMENTS, {
    ra: Number(payload.ra),
    operationId: data.operationId,
    component: payload.components,
    coefficients: payload.coefficients,
  });
  return { success: true, status: 'applied', operationId: data.operationId };
}

export const studentSyncProcessingJob = defineJob(
  JOB_NAMES.STUDENT_SYNC_PROCESSING
)
  .input(studentSyncJobSchema)
  .handler(async ({ job, app }) => processStudentSync(app, job.data));
