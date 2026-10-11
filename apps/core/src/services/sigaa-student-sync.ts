import { randomUUID } from 'node:crypto';

import { UfabcParserConnector } from '@/connectors/ufabc-parser.js';
import { AcademicSyncOperationModel } from '@/models/AcademicIdentity.js';
import { UserModel } from '@/models/User.js';
import { issueAcademicCredential } from '@/services/academic-credential.js';

// Request hints are not ownership evidence. Only a correlated parser result
// proving the authenticated session identity may change the current binding.
export async function syncStudentFromSigaa(
  app: any,
  params: { ra: number; login: string },
  sigaaSession: { sessionId: string; viewId: string },
  requestId: string
) {
  const login = params.login.trim().toLowerCase();
  const user = await UserModel.findOne({
    email: login + '@aluno.ufabc.edu.br',
    active: true,
    confirmed: true,
  });
  if (!user)
    return {
      status: 'not_found',
      message: 'Conta confirmada não encontrada.',
    } as const;
  const operationId = randomUUID();
  const { accessToken, credentialHash, credentialExpiresAt } =
    issueAcademicCredential();
  await AcademicSyncOperationModel.create({
    operationId,
    userId: user._id,
    expectedLogin: login,
    ra: String(params.ra),
    credentialHash,
    credentialExpiresAt,
  });
  const connector = new UfabcParserConnector(requestId);
  try {
    await connector.syncStudent({
      ...sigaaSession,
      requesterKey: app.config.UFABC_PARSER_REQUESTER_KEY,
      operationId,
    });
  } catch (error) {
    // A timeout may follow a successful dispatch: accept its correlated callback.
    await AcademicSyncOperationModel.updateOne(
      { operationId, status: 'awaiting' },
      { $set: { reason: 'dispatch_unconfirmed' } }
    );
    throw error;
  }
  return {
    status: 'success',
    data: {
      ra: String(params.ra),
      login,
      operationId,
      accessToken,
      expiresAt: credentialExpiresAt.toISOString(),
    },
  } as const;
}
export default syncStudentFromSigaa;
