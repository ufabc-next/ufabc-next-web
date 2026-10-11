import { sanitizeCredentials, sanitizeHeaders } from '@next/logger/sanitize';
import type { FastifyRequest } from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AcademicRaBindingModel,
  AcademicSyncOperationModel,
} from '../../src/models/AcademicIdentity.js';
import { UserModel } from '../../src/models/User.js';
import {
  authenticateAcademicRequest,
  findAcademicCredential,
  hashAcademicCredential,
  issueAcademicCredential,
} from '../../src/services/academic-credential.js';

describe('scoped academic credential', () => {
  beforeEach(() => vi.restoreAllMocks());
  const token = 'a'.repeat(64);
  const request = (headers = { 'x-academic-token': token }) =>
    ({
      headers,
      jwtVerify: vi.fn(),
      server: { httpErrors: { unauthorized: () => new Error('unauthorized') } },
    }) as unknown as FastifyRequest;
  const operation = {
    operationId: 'operation',
    status: 'applied',
    userId: 'user',
    ownerIdentityId: 'identity',
    academicBindingId: 'binding',
    ra: '111',
  };

  it('issues random credentials and persists only their hash', () => {
    const first = issueAcademicCredential();
    expect(first.accessToken).not.toEqual(
      issueAcademicCredential().accessToken
    );
    expect(first.credentialHash).toBe(
      hashAcademicCredential(first.accessToken)
    );
    expect(first.credentialHash).not.toBe(first.accessToken);
    expect(first.credentialExpiresAt.getTime()).toBeGreaterThan(Date.now());
  });
  it('does not query with malformed or missing credentials', async () => {
    const query = vi.spyOn(AcademicSyncOperationModel, 'findOne');
    for (const value of [undefined, '', ['token'], 'invalid'])
      expect(await findAcademicCredential(value)).toBeNull();
    expect(query).not.toHaveBeenCalled();
  });
  it('requires an unexpired hash, never a raw bearer token, in the database query', async () => {
    const query = vi
      .spyOn(AcademicSyncOperationModel, 'findOne')
      .mockResolvedValue(null);
    await expect(authenticateAcademicRequest(request())).rejects.toThrow(
      'unauthorized'
    );
    expect(query).toHaveBeenCalledWith({
      credentialHash: hashAcademicCredential(token),
      credentialExpiresAt: { $gt: expect.any(Date) },
    });
  });
  it.each(['awaiting', 'failed', 'conflict', 'rejected'])(
    'rejects %s operations before reading account data',
    async (status) => {
      vi.spyOn(AcademicSyncOperationModel, 'findOne').mockResolvedValue({
        ...operation,
        status,
      } as never);
      const user = vi.spyOn(UserModel, 'findOne');
      await expect(authenticateAcademicRequest(request())).rejects.toThrow(
        'unauthorized'
      );
      expect(user).not.toHaveBeenCalled();
    }
  );
  it('requires the same active account, identity, current binding and latest operation', async () => {
    vi.spyOn(AcademicSyncOperationModel, 'findOne').mockResolvedValue(
      operation as never
    );
    const user = vi
      .spyOn(UserModel, 'findOne')
      .mockResolvedValue({
        _id: 'user',
        email: 'synthetic@aluno.ufabc.edu.br',
      } as never);
    const binding = vi
      .spyOn(AcademicRaBindingModel, 'exists')
      .mockResolvedValue({ _id: 'binding' } as never);
    const req = request();
    await authenticateAcademicRequest(req);
    expect(user).toHaveBeenCalledWith({
      _id: 'user',
      active: true,
      confirmed: true,
      academicIdentityId: 'identity',
      currentAcademicBindingId: 'binding',
    });
    expect(binding).toHaveBeenCalledWith({
      _id: 'binding',
      ownerIdentityId: 'identity',
      status: 'current',
      latestOperationId: 'operation',
    });
    expect(req.user._id).toBe('user');
    expect(req.user.permissions).toEqual([]);
    binding.mockResolvedValue(null);
    await expect(authenticateAcademicRequest(request())).rejects.toThrow(
      'unauthorized'
    );
    user.mockResolvedValue(null);
    await expect(authenticateAcademicRequest(request())).rejects.toThrow(
      'unauthorized'
    );
  });
  it('does not fall back to a capability when the supplied JWT is invalid', async () => {
    const req = request();
    req.headers.authorization = 'Bearer invalid';
    vi.mocked(req.jwtVerify).mockRejectedValue(new Error('invalid JWT'));
    const query = vi.spyOn(AcademicSyncOperationModel, 'findOne');
    await expect(authenticateAcademicRequest(req)).rejects.toThrow(
      'invalid JWT'
    );
    expect(query).not.toHaveBeenCalled();
  });
  it('redacts credentials from request headers and response objects', () => {
    expect(
      sanitizeHeaders({ 'X-Academic-Token': token, 'session-id': token })
    ).toEqual({ 'X-Academic-Token': '[REDACTED]', 'session-id': '[REDACTED]' });
    expect(
      sanitizeCredentials({ data: { accessToken: token, operationId: 'id' } })
    ).toEqual({ data: { accessToken: '[REDACTED]', operationId: 'id' } });
  });
});
