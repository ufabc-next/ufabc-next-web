import mongoose, { type ClientSession } from 'mongoose';

import {
  AcademicIdentityModel,
  AcademicRaBindingModel,
  AcademicSyncOperationModel,
} from '@/models/AcademicIdentity.js';
import { EnrollmentModel } from '@/models/Enrollment.js';
import { GraduationHistoryModel } from '@/models/GraduationHistory.js';
import { HistoryModel } from '@/models/History.js';
import { StudentModel } from '@/models/Student.js';
import { UserModel, UserRaHistoryModel } from '@/models/User.js';

export type VerifiedAcademicSession = { login: string; ra: string };
export type OwnedAcademicContext = {
  ownerIdentityId: NonNullable<
    ReturnType<typeof AcademicRaBindingModel.hydrate>['ownerIdentityId']
  >;
  academicBindingId: ReturnType<typeof AcademicRaBindingModel.hydrate>['_id'];
  ownershipStatus: 'confirmed';
  sourceOperationId: string;
};

export function proofMatches(
  expected: { expectedLogin: string; ra: string },
  proof: VerifiedAcademicSession
) {
  return (
    expected.expectedLogin === proof.login.trim().toLowerCase() &&
    expected.ra === proof.ra
  );
}

// Called only by the authenticated parser webhook, never a browser-supplied proof.
export async function applyVerifiedAcademicSync(
  operationId: string,
  proof: VerifiedAcademicSession,
  payloadHash: string,
  persist: (
    context: OwnedAcademicContext,
    session: ClientSession
  ) => Promise<void>
) {
  return mongoose.connection.transaction(async (session) => {
    const operation = await AcademicSyncOperationModel.findOne({
      operationId,
    }).session(session);
    if (!operation)
      return { status: 'rejected' as const, reason: 'unknown_operation' };
    if (operation.status !== 'awaiting') {
      if (operation.payloadHash !== payloadHash)
        return { status: 'rejected' as const, reason: 'payload_changed' };
      return { status: operation.status, operation };
    }
    const reject = async (status: 'rejected' | 'conflict', reason: string) => {
      operation.status = status;
      operation.reason = reason;
      await operation.save({ session });
      return { status, reason };
    };
    if (!proofMatches(operation, proof))
      return reject('rejected', 'session_identity_mismatch');
    const user = await UserModel.findById(operation.userId).session(session);
    if (
      !user?.active ||
      !user.confirmed ||
      user.email !== `${operation.expectedLogin}@aluno.ufabc.edu.br`
    ) {
      return reject('rejected', 'account_not_verified');
    }
    if (
      user.academicVerifiedAt &&
      user.academicVerifiedAt >= operation.createdAt
    ) {
      return reject('rejected', 'superseded_operation');
    }
    const holder = await AcademicRaBindingModel.findOne({
      institution: 'ufabc',
      ra: proof.ra,
      status: 'current',
    }).session(session);
    const legacyHolder = await UserModel.exists({
      ra: Number(proof.ra),
      _id: { $ne: user._id },
    }).session(session);
    if (
      legacyHolder ||
      (holder && !holder.ownerIdentityId.equals(user.academicIdentityId))
    ) {
      return reject('conflict', 'ra_requires_review');
    }
    if (!user.academicIdentityId) {
      const [identity] = await AcademicIdentityModel.create(
        [{ createdBy: user._id }],
        { session }
      );
      user.academicIdentityId = identity._id;
    }
    let binding = await AcademicRaBindingModel.findOne({
      ownerIdentityId: user.academicIdentityId,
      status: 'current',
    }).session(session);
    if (binding && binding.ra !== proof.ra) {
      binding.status = 'closed';
      binding.closedAt = new Date();
      binding.revision += 1;
      await binding.save({ session });
      const filter = {
        academicBindingId: binding._id,
        ownerIdentityId: user.academicIdentityId,
      };
      await StudentModel.updateMany(
        filter,
        { $set: { active: false } },
        { session }
      );
      await HistoryModel.updateMany(
        filter,
        { $set: { active: false } },
        { session }
      );
      await GraduationHistoryModel.updateMany(
        filter,
        { $set: { active: false } },
        { session }
      );
      await EnrollmentModel.updateMany(
        filter,
        { $set: { active: false } },
        { session }
      );
      binding = null;
    }
    if (!binding) {
      [binding] = await AcademicRaBindingModel.create(
        [
          {
            ownerIdentityId: user.academicIdentityId,
            ra: proof.ra,
            status: 'current',
            verifiedAt: new Date(),
            evidenceRef: operationId,
          },
        ],
        { session }
      );
    }
    if (user.ra != null && String(user.ra) !== proof.ra) {
      await UserRaHistoryModel.create(
        [{ userId: user._id, Ra: String(user.ra) }],
        { session }
      );
    }
    user.ra = Number(proof.ra);
    user.currentAcademicBindingId = binding._id;
    user.academicVerifiedAt = operation.createdAt;
    await user.save({ session });
    binding.latestOperationId = operationId;
    binding.revision += 1;
    await binding.save({ session });
    const context: OwnedAcademicContext = {
      ownerIdentityId: user.academicIdentityId,
      academicBindingId: binding._id,
      ownershipStatus: 'confirmed',
      sourceOperationId: operationId,
    };
    await persist(context, session);
    operation.ownerIdentityId = context.ownerIdentityId;
    operation.academicBindingId = context.academicBindingId;
    operation.status = 'applied';
    operation.payloadHash = payloadHash;
    await operation.save({ session });
    return { status: 'applied' as const, operation };
  });
}
