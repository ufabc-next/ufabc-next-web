import { createHash, randomBytes } from 'node:crypto';

import type { FastifyRequest } from 'fastify';

import {
  AcademicRaBindingModel,
  AcademicSyncOperationModel,
} from '@/models/AcademicIdentity.js';
import { UserModel } from '@/models/User.js';

export function issueAcademicCredential() {
  const accessToken = randomBytes(32).toString('hex');
  return {
    accessToken,
    credentialHash: hashAcademicCredential(accessToken),
    credentialExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

export function hashAcademicCredential(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function findAcademicCredential(token: unknown) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return null;
  return AcademicSyncOperationModel.findOne({
    credentialHash: hashAcademicCredential(token),
    credentialExpiresAt: { $gt: new Date() },
  });
}

// Opt in only on the extension's academic routes. This is never a portal JWT.
export async function authenticateAcademicRequest(request: FastifyRequest) {
  if (request.headers.authorization) {
    await request.jwtVerify();
    return;
  }
  const operation = await findAcademicCredential(
    request.headers['x-academic-token']
  );
  if (
    !operation ||
    operation.status !== 'applied' ||
    !operation.ownerIdentityId ||
    !operation.academicBindingId
  ) {
    throw request.server.httpErrors.unauthorized(
      'Sincronize sua sessão no SIGAA.'
    );
  }
  const user = await UserModel.findOne({
    _id: operation.userId,
    active: true,
    confirmed: true,
    academicIdentityId: operation.ownerIdentityId,
    currentAcademicBindingId: operation.academicBindingId,
  });
  const binding =
    user &&
    (await AcademicRaBindingModel.exists({
      _id: operation.academicBindingId,
      ownerIdentityId: operation.ownerIdentityId,
      status: 'current',
      latestOperationId: operation.operationId,
    }));
  if (!user || !user.email || !binding) {
    throw request.server.httpErrors.unauthorized(
      'Sincronize sua sessão no SIGAA.'
    );
  }
  request.user = {
    _id: String(user._id),
    email: user.email,
    ra: Number(operation.ra),
    confirmed: true,
    permissions: [],
  };
}
