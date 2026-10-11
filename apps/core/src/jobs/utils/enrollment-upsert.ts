import type { FastifyBaseLogger } from 'fastify';
import mongoose from 'mongoose';

import {
  AcademicRaBindingModel,
  AcademicSyncOperationModel,
} from '@/models/AcademicIdentity.js';
import { EnrollmentModel, type Enrollment } from '@/models/Enrollment.js';

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

export async function upsertEnrollment(
  enrollmentData: Partial<Enrollment>,
  log: FastifyBaseLogger
): Promise<string | null> {
  if (!enrollmentData.sourceOperationId || !enrollmentData.recordKey) {
    log.warn('Enrollment without verified provenance was not assigned');
    return null;
  }
  return (
    (await mongoose.connection.transaction(async (session) => {
      const operation = await AcademicSyncOperationModel.findOne({
        operationId: enrollmentData.sourceOperationId,
        status: 'applied',
      }).session(session);
      if (!operation || operation.ra !== String(enrollmentData.ra)) return null;
      // This write conflicts with closure/newer sync in the same binding. A retry
      // rechecks the current operation and cannot reactivate an archived binding.
      const binding = await AcademicRaBindingModel.findOneAndUpdate(
        {
          _id: operation.academicBindingId,
          ownerIdentityId: operation.ownerIdentityId,
          status: 'current',
          latestOperationId: operation.operationId,
        },
        { $inc: { revision: 1 } },
        { session, new: true }
      );
      if (!binding) return null;
      const enrollment = await EnrollmentModel.findOneAndUpdate(
        { academicBindingId: binding._id, recordKey: enrollmentData.recordKey },
        {
          $set: {
            ...enrollmentData,
            academicBindingId: binding._id,
            ownerIdentityId: binding.ownerIdentityId,
            ownershipStatus: 'confirmed',
            active: true,
          },
        },
        { upsert: true, new: true, session }
      );
      return enrollment._id.toString();
    })) ?? null
  );
}
