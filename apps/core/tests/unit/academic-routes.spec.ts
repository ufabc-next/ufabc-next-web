import jwt from '@fastify/jwt';
import sensible from '@fastify/sensible';
import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { studentsController } from '../../src/controllers/students-controller.js';
import {
  AcademicRaBindingModel,
  AcademicSyncOperationModel,
} from '../../src/models/AcademicIdentity.js';
import { StudentModel } from '../../src/models/Student.js';
import { UserModel } from '../../src/models/User.js';
import authHooks from '../../src/routes/autohooks.js';
import * as access from '../../src/services/academic-access.js';

describe('academic route authentication boundary', () => {
  const token = 'a'.repeat(64);
  let app: ReturnType<typeof Fastify>;
  beforeEach(async () => {
    vi.restoreAllMocks();
    app = Fastify();
    await app.register(sensible);
    await app.register(jwt, { secret: 'synthetic-test-secret' });
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    vi.spyOn(AcademicSyncOperationModel, 'findOne').mockResolvedValue({
      operationId: 'operation',
      status: 'applied',
      ownerIdentityId: 'identity',
      academicBindingId: 'binding',
      userId: 'user',
      ra: '111',
    } as never);
    vi.spyOn(UserModel, 'findOne').mockResolvedValue({
      _id: 'user',
      email: 'synthetic@aluno.ufabc.edu.br',
    } as never);
    vi.spyOn(AcademicRaBindingModel, 'exists').mockResolvedValue({
      _id: 'binding',
    } as never);
  });
  afterEach(async () => {
    await app.close();
  });

  it('does not authorize portal routes or arbitrary Student subpaths with a capability', async () => {
    await authHooks(app);
    app.get('/entities/students', async (request) => ({
      userId: request.user._id,
    }));
    for (const url of [
      '/users/info',
      '/comments',
      '/entities/students/other',
    ]) {
      app.get(url, async () => ({ sensitive: true }));
    }
    const headers = { 'x-academic-token': token };
    expect(
      (await app.inject({ url: '/entities/students', headers })).statusCode
    ).toBe(200);
    for (const url of [
      '/users/info',
      '/comments',
      '/entities/students/other',
    ]) {
      expect((await app.inject({ url, headers })).statusCode).toBe(401);
    }
  });
  it('preserves credential headers through validation and scopes the real Student query to ownership', async () => {
    await app.register(studentsController, { prefix: '/v2' });
    vi.spyOn(access, 'academicAccessFilter').mockResolvedValue({
      ownerIdentityId: 'identity',
      ownershipStatus: 'confirmed',
      academicBindingId: { $in: ['binding'] },
    } as never);
    const students = vi
      .spyOn(StudentModel, 'find')
      .mockResolvedValue([{ cursos: [], ra: 111 }] as never);
    const response = await app.inject({
      url: '/v2/students',
      headers: { 'x-academic-token': token, login: ' Synthetic ' },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ graduations: [], ra: 111 });
    expect(students).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerIdentityId: 'identity',
        academicBindingId: { $in: ['binding'] },
        login: 'synthetic',
      })
    );
  });
  it('rejects polling a completed operation whose credential was superseded', async () => {
    await app.register(studentsController, { prefix: '/v2' });
    vi.mocked(AcademicRaBindingModel.exists).mockResolvedValue(null);
    const response = await app.inject({
      url: '/v2/students/sigaa/status',
      headers: { 'x-academic-token': token },
    });
    expect(response.statusCode).toBe(401);
  });

  it('exposes only operation status while awaiting, and never academic data', async () => {
    await app.register(studentsController, { prefix: '/v2' });
    vi.mocked(AcademicSyncOperationModel.findOne).mockResolvedValue({
      operationId: 'operation',
      status: 'awaiting',
      ra: '111',
      expectedLogin: 'synthetic',
    } as never);
    const headers = { 'x-academic-token': token };
    const response = await app.inject({
      url: '/v2/students/sigaa/status',
      headers,
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.json()).toEqual({
      operationId: 'operation',
      status: 'awaiting',
    });
    expect(
      (
        await app.inject({
          url: '/v2/students',
          headers: { ...headers, login: 'synthetic' },
        })
      ).statusCode
    ).toBe(401);
  });
});
