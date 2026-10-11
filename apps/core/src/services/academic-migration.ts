import { createHash } from 'node:crypto';

import mongoose, { Types } from 'mongoose';
import { z } from 'zod';

import {
  AcademicIdentityModel,
  AcademicRaBindingModel,
} from '@/models/AcademicIdentity.js';
import { CommentModel } from '@/models/Comment.js';
import { EnrollmentModel } from '@/models/Enrollment.js';
import { GraduationHistoryModel } from '@/models/GraduationHistory.js';
import { HistoryModel } from '@/models/History.js';
import { StudentModel } from '@/models/Student.js';
import { UserModel } from '@/models/User.js';

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i)
  .transform((value) => value.toLowerCase());
export const academicMigrationSchema = z
  .object({
    entries: z
      .array(
        z
          .object({
            userId: objectId,
            ra: z.string().regex(/^\d+$/),
            evidenceRef: z.string().min(1),
            validFrom: z.string().datetime().optional(),
            validTo: z.string().datetime().optional(),
            // Explicit review can release a contested current RA without transferring data.
            releaseCurrentRa: z.boolean().default(false),
            records: z.array(
              z
                .object({
                  collection: z.enum([
                    'alunos',
                    'enrollments',
                    'histories',
                    'historiesgraduations',
                  ]),
                  id: objectId,
                })
                .strict()
            ),
            // Authorship is reviewed separately; never inferred from RA or enrollment.
            commentIds: z.array(objectId).default([]),
          })
          .strict()
      )
      .min(1),
  })
  .strict();

const migrationModels = [
  StudentModel,
  EnrollmentModel,
  HistoryModel,
  GraduationHistoryModel,
] as const;

export async function migrateAcademicOwnership(input: unknown, apply = false) {
  const manifest = academicMigrationSchema.parse(input);
  const seen = new Set<string>();
  const intervals: Array<{ ra: string; from: number; to: number }> = [];
  for (const entry of manifest.entries) {
    if (entry.validFrom && entry.validTo && entry.validFrom >= entry.validTo)
      throw new Error('Invalid validity interval');
    if (entry.validFrom && entry.validTo) {
      const interval = {
        ra: entry.ra,
        from: Date.parse(entry.validFrom),
        to: Date.parse(entry.validTo),
      };
      if (
        intervals.some(
          (previous) =>
            previous.ra === interval.ra &&
            previous.from < interval.to &&
            interval.from < previous.to
        )
      ) {
        throw new Error('Reviewed validity intervals overlap');
      }
      intervals.push(interval);
    }
    for (const key of [
      ...entry.records.map((record) => `${record.collection}:${record.id}`),
      ...entry.commentIds.map((id) => `comments:${id}`),
    ]) {
      if (seen.has(key)) throw new Error('Duplicate document in manifest');
      seen.add(key);
    }
  }
  const manifestId = createHash('sha256')
    .update(JSON.stringify(manifest))
    .digest('hex');
  const db = mongoose.connection.db;
  if (!db) throw new Error('Database is not connected');
  // One transaction for validation + apply, including every reviewed document.
  const session = await mongoose.startSession();
  let records = 0;
  try {
    await session.withTransaction(async () => {
      records = 0;
      for (const [index, entry] of manifest.entries.entries()) {
        const user = await UserModel.findById(entry.userId).session(session);
        if (!user) throw new Error('Migration account not found');
        const evidenceRef = `migration:${manifestId}:${index}`;
        let binding = await AcademicRaBindingModel.findOne({
          evidenceRef,
        }).session(session);
        if (entry.validFrom && entry.validTo) {
          const overlap = await AcademicRaBindingModel.exists({
            institution: 'ufabc',
            ra: entry.ra,
            evidenceRef: { $ne: evidenceRef },
            validFrom: { $ne: null, $lt: new Date(entry.validTo) },
            validTo: { $ne: null, $gt: new Date(entry.validFrom) },
          }).session(session);
          if (overlap) throw new Error('Reviewed validity intervals overlap');
        }
        if (apply && !user.academicIdentityId) {
          const [identity] = await AcademicIdentityModel.create(
            [{ createdBy: user._id }],
            { session }
          );
          user.academicIdentityId = identity._id;
        }
        if (apply && !binding) {
          [binding] = await AcademicRaBindingModel.create(
            [
              {
                ownerIdentityId: user.academicIdentityId!,
                ra: entry.ra,
                status: 'closed',
                verifiedAt: new Date(),
                closedAt: new Date(),
                evidenceRef,
                validFrom: entry.validFrom ? new Date(entry.validFrom) : null,
                validTo: entry.validTo ? new Date(entry.validTo) : null,
              },
            ],
            { session }
          );
        }
        for (const record of entry.records) {
          const collection = db.collection(record.collection);
          const _id = new Types.ObjectId(record.id);
          const document = await collection.findOne({ _id }, { session });
          if (!document || String(document.ra) !== entry.ra)
            throw new Error(
              'Document missing or RA differs from reviewed evidence'
            );
          const alreadyAssigned =
            binding &&
            document.academicBindingId?.equals(binding._id) &&
            document.ownerIdentityId?.equals(user.academicIdentityId);
          if (
            !alreadyAssigned &&
            (document.ownerIdentityId ||
              document.academicBindingId ||
              document.ownershipStatus === 'confirmed')
          ) {
            throw new Error('Migration cannot overwrite existing ownership');
          }
          if (apply && binding && !alreadyAssigned) {
            await collection.updateOne(
              { _id },
              {
                $set: {
                  academicBindingId: binding._id,
                  ownerIdentityId: user.academicIdentityId,
                  ownershipStatus: 'confirmed',
                  sourceOperationId: evidenceRef,
                  ownershipEvidenceRef: entry.evidenceRef,
                  recordKey: `legacy:${record.id}`,
                  active: false,
                },
              },
              { session }
            );
          }
          records++;
        }
        for (const id of entry.commentIds) {
          const comment = await CommentModel.findById(id).session(session);
          if (
            !comment ||
            (comment.authorUserId &&
              comment.authorUserId.toString() !== user._id.toString())
          )
            throw new Error('Comment authorship conflict');
          const enrollment = await EnrollmentModel.findById(
            comment.enrollment
          ).session(session);
          const reviewedEnrollment = entry.records.some(
            (record) =>
              record.collection === 'enrollments' &&
              record.id === comment.enrollment?.toString()
          );
          if (
            !enrollment ||
            (!reviewedEnrollment &&
              !enrollment.ownerIdentityId?.equals(user.academicIdentityId))
          )
            throw new Error(
              'Comment enrollment is not owned by reviewed identity'
            );
          if (apply) {
            comment.authorUserId = user._id;
            await comment.save({ session });
          }
        }
        if (entry.releaseCurrentRa) {
          const current = await AcademicRaBindingModel.findOne({
            ownerIdentityId: user.academicIdentityId,
            status: 'current',
            ra: entry.ra,
          }).session(session);
          if (user.ra != null && String(user.ra) !== entry.ra)
            throw new Error('Current RA changed since review');
          if (apply) {
            if (current) {
              current.status = 'closed';
              current.closedAt = new Date();
              current.revision += 1;
              await current.save({ session });
              for (const model of migrationModels) {
                await model.collection.updateMany(
                  { academicBindingId: current._id },
                  { $set: { active: false } },
                  { session }
                );
              }
            }
            user.set({
              ra: null,
              currentAcademicBindingId: null,
              academicVerifiedAt: new Date(),
            });
          }
        }
        if (apply) await user.save({ session });
      }
      // Dry run makes no writes, including identities or bindings.
    });
  } finally {
    await session.endSession();
  }
  return {
    manifestId,
    applied: apply,
    entries: manifest.entries.length,
    records,
  };
}
