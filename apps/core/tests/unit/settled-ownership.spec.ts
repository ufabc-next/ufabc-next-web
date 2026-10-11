import type { FastifyBaseLogger } from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { processSettledEnrollments } from '../../src/jobs/settled-enrollments-processing.js';
import { enrollmentRecordKey } from '../../src/jobs/utils/enrollment-record-key.js';
import * as upserts from '../../src/jobs/utils/enrollment-upsert.js';
import {
  AcademicPendingEventModel,
  AcademicSyncOperationModel,
} from '../../src/models/AcademicIdentity.js';
import { ComponentModel } from '../../src/models/Component.js';

describe('settled enrollment ownership', () => {
  beforeEach(() => vi.restoreAllMocks());
  const event = {
    event: 'class.settled' as const,
    deliveryId: 'delivery',
    timestamp: '2025-01-01T00:00:00Z',
    data: {
      operationId: 'operation',
      verifiedSession: { login: 'synthetic', ra: '111' },
      ra: '111',
      season: '2025:1',
      tenantId: 1,
      classes: ['synthetic-class'],
    },
  };
  const log = {} as FastifyBaseLogger;
  it('retains uncorrelated events without resolving the current RA holder', async () => {
    const pending = vi
      .spyOn(AcademicPendingEventModel, 'updateOne')
      .mockResolvedValue({} as never);
    const operation = vi.spyOn(AcademicSyncOperationModel, 'findOne');
    await processSettledEnrollments(
      { ...event, data: { ...event.data, operationId: undefined } },
      log
    );
    expect(pending).toHaveBeenCalledOnce();
    expect(operation).not.toHaveBeenCalled();
  });
  it('rejects a proof from another session even when RA matches', async () => {
    vi.spyOn(AcademicSyncOperationModel, 'findOne').mockResolvedValue({
      expectedLogin: 'another',
      ra: '111',
      status: 'applied',
    } as never);
    vi.spyOn(AcademicPendingEventModel, 'updateOne').mockResolvedValue(
      {} as never
    );
    const components = vi.spyOn(ComponentModel, 'findOne');
    expect((await processSettledEnrollments(event, log)).success).toBe(false);
    expect(components).not.toHaveBeenCalled();
  });
  it('retries events received before the verified synchronization commits', async () => {
    vi.spyOn(AcademicSyncOperationModel, 'findOne').mockResolvedValue({
      expectedLogin: 'synthetic',
      ra: '111',
      status: 'awaiting',
    } as never);
    await expect(processSettledEnrollments(event, log)).rejects.toThrow(
      'Awaiting'
    );
  });
  it('uses the verified operation without clearing transcript grades', async () => {
    vi.spyOn(AcademicSyncOperationModel, 'findOne').mockResolvedValue({
      operationId: 'operation',
      expectedLogin: 'synthetic',
      ra: '111',
      status: 'applied',
    } as never);
    vi.spyOn(ComponentModel, 'findOne').mockReturnValue({
      lean: vi.fn().mockResolvedValue({ disciplina: 'Synthetic', turma: 'A' }),
    } as never);
    const write = vi
      .spyOn(upserts, 'upsertEnrollment')
      .mockResolvedValue('enrollment');
    expect((await processSettledEnrollments(event, log)).success).toBe(true);
    const data = write.mock.calls[0][0];
    expect(data.sourceOperationId).toBe('operation');
    expect(data.recordKey).toBe(
      enrollmentRecordKey('2025', '1', 'subject-code', 'synthetic-class')
    );
    expect(data).not.toHaveProperty('conceito');
    expect(data).not.toHaveProperty('cr_acumulado');
  });
});
