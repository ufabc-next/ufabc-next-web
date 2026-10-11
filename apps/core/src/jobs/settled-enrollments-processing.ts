import { defineJob } from '@next/queues/client';
import type { FastifyBaseLogger } from 'fastify';
import type { z } from 'zod';

import { JOB_NAMES } from '@/constants.js';
import {
  AcademicPendingEventModel,
  AcademicSyncOperationModel,
} from '@/models/AcademicIdentity.js';
import { ComponentModel } from '@/models/Component.js';
import { ClassSettledEventSchema } from '@/schemas/v2/webhook/ufabc-parser.js';
import { proofMatches } from '@/services/academic-identity.js';

import { enrollmentRecordKey } from './utils/enrollment-record-key.js';
import { upsertEnrollment } from './utils/enrollment-upsert.js';

export async function processSettledEnrollments(
  event: z.infer<typeof ClassSettledEventSchema>,
  log: FastifyBaseLogger
) {
  const { data } = event;
  const retain = async (reason: string) => {
    await AcademicPendingEventModel.updateOne(
      { deliveryId: event.deliveryId },
      {
        $setOnInsert: { reason, payload: event },
      },
      { upsert: true }
    );
    return { success: false, status: 'pending_identity' };
  };
  if (!data.operationId || !data.verifiedSession)
    return retain('settled_missing_session_proof');
  const operation = await AcademicSyncOperationModel.findOne({
    operationId: data.operationId,
  });
  if (
    !operation ||
    operation.ra !== data.ra ||
    !proofMatches(operation, data.verifiedSession)
  )
    return retain('settled_invalid_session_proof');
  if (operation.status === 'awaiting')
    throw new Error('Awaiting verified academic synchronization');
  if (operation.status !== 'applied')
    return retain('settled_operation_not_applied');
  if (!/^\d{4}:[123]$/.test(data.season))
    return retain('settled_invalid_season');
  const [year, quad] = data.season.split(':').map(Number);
  const results = [];
  for (const classCode of new Set(data.classes)) {
    const component = await ComponentModel.findOne({
      season: data.season,
      uf_cod_turma: classCode,
    }).lean();
    if (!component) {
      // Retry after the independent component webhook is processed.
      throw new Error('Settled enrollment component is not available yet');
    }
    const enrollmentId = await upsertEnrollment(
      {
        ra: Number(data.ra),
        year,
        quad,
        season: data.season,
        sourceOperationId: operation.operationId,
        recordKey: enrollmentRecordKey(year, quad, '', classCode),
        disciplina: component.disciplina.toLowerCase(),
        disciplina_id: component.disciplina_id,
        turma: component.turma,
        uf_cod_turma: classCode,
        campus: component.campus,
        turno: component.turno,
        subject: component.subject,
        teoria: component.teoria,
        pratica: component.pratica,
        syncedBy: 'ufabc-parser',
        // Settlement must not erase transcript grades or coefficients.
      },
      log
    );
    if (!enrollmentId) return retain('settled_binding_no_longer_current');
    results.push(enrollmentId);
  }
  return { success: true, status: 'processed', processed: results.length };
}

export const settledEnrollmentsProcessingJob = defineJob(
  JOB_NAMES.PROCESS_SETTLED_ENROLLMENTS
)
  .input(ClassSettledEventSchema)
  .handler(async ({ job, app }) =>
    processSettledEnrollments(job.data, app.log)
  );
