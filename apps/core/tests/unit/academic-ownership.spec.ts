import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { processStudentSync } from '../../src/jobs/student-sync-processing.js';
import { upsertEnrollment } from '../../src/jobs/utils/enrollment-upsert.js';
import { AcademicPendingEventModel } from '../../src/models/AcademicIdentity.js';
import { AcademicRaBindingModel } from '../../src/models/AcademicIdentity.js';
import { EnrollmentModel } from '../../src/models/Enrollment.js';
import { UserModel } from '../../src/models/User.js';
import { academicAccessFilter } from '../../src/services/academic-access.js';
import { proofMatches } from '../../src/services/academic-identity.js';
import {
  academicMigrationSchema,
  migrateAcademicOwnership,
} from '../../src/services/academic-migration.js';

describe('academic ownership access policy', () => {
  beforeEach(() => vi.restoreAllMocks());
  it('retains uncorrelated webhooks without mutating academic records or dispatching jobs', async () => {
    const pending = vi
      .spyOn(AcademicPendingEventModel, 'updateOne')
      .mockResolvedValue({} as never);
    const write = vi.spyOn(EnrollmentModel, 'findOneAndUpdate');
    const dispatch = vi.fn();
    const result = await processStudentSync(
      { manager: { dispatch } },
      {
        deliveryId: '00000000-0000-4000-8000-000000000001',
        event: 'student.failed',
        timestamp: '2025-01-01T00:00:00Z',
        data: {
          ra: '111',
          timestamp: '2025-01-01T00:00:00Z',
          error: {
            title: 'Synthetic',
            code: 'fixture',
            httpStatus: 500,
            description: 'Synthetic',
          },
        },
      }
    );
    expect(result.status).toBe('pending_identity');
    expect(pending).toHaveBeenCalledOnce();
    expect(write).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
  it('inserts immutable ownership on an upsert instead of silently dropping it', async () => {
    const ownerIdentityId = new Types.ObjectId();
    const academicBindingId = new Types.ObjectId();
    const driver = vi
      .spyOn(EnrollmentModel.collection, 'findOneAndUpdate')
      .mockResolvedValue(null as never);
    await EnrollmentModel.findOneAndUpdate(
      { academicBindingId, recordKey: 'synthetic' },
      {
        $set: {
          ownerIdentityId,
          academicBindingId,
          ownershipStatus: 'confirmed',
          recordKey: 'synthetic',
          ra: 111,
          year: 2025,
          quad: 1,
          disciplina: 'Synthetic',
        },
      },
      { upsert: true }
    );
    const update = driver.mock.calls[0][1] as {
      $setOnInsert: Record<string, unknown>;
    };
    expect(update.$setOnInsert.ownerIdentityId).toEqual(ownerIdentityId);
    expect(update.$setOnInsert.academicBindingId).toEqual(academicBindingId);
  });
  it('does not accept a login or RA different from the verified session', () => {
    const expected = { expectedLogin: 'synthetic', ra: '111' };
    expect(proofMatches(expected, { login: 'synthetic', ra: '111' })).toBe(
      true
    );
    expect(proofMatches(expected, { login: 'other', ra: '111' })).toBe(false);
    expect(proofMatches(expected, { login: 'synthetic', ra: '222' })).toBe(
      false
    );
  });
  it.each([
    null,
    { active: false, academicIdentityId: new Types.ObjectId() },
    { active: true },
  ])('denies missing, disabled or unresolved identity: %j', async (user) => {
    vi.spyOn(UserModel, 'findById').mockReturnValue({
      lean: async () => user,
    } as never);
    const filter = await academicAccessFilter(new Types.ObjectId().toString());
    expect(filter.academicBindingId.$in).toEqual([]);
    expect(filter).not.toHaveProperty('ra');
  });
  it('includes closed bindings without an active filter for historical access', async () => {
    const identity = new Types.ObjectId();
    const binding = new Types.ObjectId();
    vi.spyOn(UserModel, 'findById').mockReturnValue({
      lean: async () => ({ active: true, academicIdentityId: identity }),
    } as never);
    const find = vi.spyOn(AcademicRaBindingModel, 'find').mockReturnValue({
      select: () => ({ lean: async () => [{ _id: binding }] }),
    } as never);
    expect(await academicAccessFilter(new Types.ObjectId().toString())).toEqual(
      {
        ownerIdentityId: identity,
        ownershipStatus: 'confirmed',
        academicBindingId: { $in: [binding] },
      }
    );
    expect(find).toHaveBeenCalledWith({ ownerIdentityId: identity });
    await academicAccessFilter(new Types.ObjectId().toString(), true);
    expect(find).toHaveBeenLastCalledWith({
      ownerIdentityId: identity,
      status: 'current',
    });
  });
  it('never upserts an enrollment provided only with an RA', async () => {
    const log = { warn: vi.fn() };
    expect(await upsertEnrollment({ ra: 111 }, log as never)).toBeNull();
    expect(log.warn).toHaveBeenCalledOnce();
  });
  it('requires explicit migration evidence and rejects ambiguous duplicate assignments before DB access', async () => {
    const entry = {
      userId: new Types.ObjectId().toString(),
      ra: '111',
      evidenceRef: 'synthetic',
      records: [
        { collection: 'histories', id: new Types.ObjectId().toString() },
      ],
    };
    expect(
      academicMigrationSchema.safeParse({
        entries: [{ ...entry, evidenceRef: '' }],
      }).success
    ).toBe(false);
    await expect(
      migrateAcademicOwnership({ entries: [entry, entry] })
    ).rejects.toThrow('Duplicate document');
    await expect(
      migrateAcademicOwnership({
        entries: [
          {
            ...entry,
            validFrom: '2025-02-01T00:00:00Z',
            validTo: '2025-01-01T00:00:00Z',
          },
        ],
      })
    ).rejects.toThrow('Invalid validity interval');
  });
});
