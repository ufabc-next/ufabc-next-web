import { randomUUID } from 'node:crypto';

import { startMongoTestDatabase } from '@next/testing/containers';
import mongoose from 'mongoose';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { upsertEnrollment } from '../../src/jobs/utils/enrollment-upsert.js';
import {
  AcademicIdentityModel,
  AcademicRaBindingModel,
  AcademicSyncOperationModel,
} from '../../src/models/AcademicIdentity.js';
import { EnrollmentModel } from '../../src/models/Enrollment.js';
import { HistoryModel } from '../../src/models/History.js';
import { UserModel } from '../../src/models/User.js';
import { academicAccessFilter } from '../../src/services/academic-access.js';
import { applyVerifiedAcademicSync } from '../../src/services/academic-identity.js';
import { ensureAcademicIndexes } from '../../src/services/academic-indexes.js';
import { migrateAcademicOwnership } from '../../src/services/academic-migration.js';

describe('academic ownership transactions', () => {
  let container: Awaited<ReturnType<typeof startMongoTestDatabase>> | undefined;
  let clock = 0;
  beforeAll(async () => {
    container = await startMongoTestDatabase();
    await mongoose.connect(container.getConnectionString(), {
      dbName: 'academic-ownership-test',
    });
    await UserModel.init();
    await ensureAcademicIndexes();
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await container?.stop();
  });
  beforeEach(async () => {
    for (const collection of Object.values(mongoose.connection.collections))
      await collection.deleteMany({});
  });
  const account = (login: string) =>
    UserModel.create({ email: `${login}@aluno.ufabc.edu.br`, confirmed: true });
  async function operation(
    user: Awaited<ReturnType<typeof account>>,
    ra: string
  ) {
    return AcademicSyncOperationModel.create({
      operationId: randomUUID(),
      userId: user._id,
      expectedLogin: user.email!.split('@')[0],
      ra,
      createdAt: new Date(1_700_000_000_000 + ++clock),
    });
  }
  async function apply(op: Awaited<ReturnType<typeof operation>>) {
    return applyVerifiedAcademicSync(
      op.operationId,
      { login: op.expectedLogin, ra: op.ra },
      'fixture',
      async (ownership, session) => {
        await EnrollmentModel.create(
          [
            {
              ...ownership,
              ra: Number(op.ra),
              recordKey: 'fixture',
              year: 2025,
              quad: 1,
              season: '2025:1',
              disciplina: 'Synthetic subject',
              conceito: 'A',
            },
          ],
          { session }
        );
        await HistoryModel.create(
          [
            {
              ...ownership,
              ra: Number(op.ra),
              recordKey: 'fixture',
              curso: 'Synthetic course',
              disciplinas: [],
            },
          ],
          { session }
        );
      }
    );
  }
  async function visible(user: Awaited<ReturnType<typeof account>>) {
    return EnrollmentModel.find(
      await academicAccessFilter(user._id.toString())
    ).lean();
  }

  it('preserves both RAs, excludes another person and never claims RA-only legacy data', async () => {
    const a = await account('synthetic-a');
    const b = await account('synthetic-b');
    await apply(await operation(b, '222'));
    await apply(await operation(b, '333'));
    await apply(await operation(a, '111'));
    await apply(await operation(a, '222'));
    await EnrollmentModel.create({
      ra: 222,
      year: 2020,
      quad: 1,
      disciplina: 'Unknown legacy owner',
      conceito: 'A',
    });
    expect((await visible(a)).map((row) => row.ra).sort()).toEqual([111, 222]);
    expect((await visible(b)).map((row) => row.ra).sort()).toEqual([222, 333]);
    expect((await visible(a)).find((row) => row.ra === 111)?.active).toBe(
      false
    );
    const foreign = (await visible(b))[0];
    expect(
      await EnrollmentModel.findOne({
        ...(await academicAccessFilter(a._id.toString())),
        _id: foreign._id,
      })
    ).toBeNull();
  });

  it('blocks current conflicts regardless of account updatedAt', async () => {
    const a = await account('synthetic-a');
    const b = await account('synthetic-b');
    await apply(await operation(b, '222'));
    const result = await apply(await operation(a, '222'));
    expect(result?.status).toBe('conflict');
    expect(await visible(a)).toHaveLength(0);
    expect(await visible(b)).toHaveLength(1);
  });

  it('creates another occurrence on return to the same RA and rejects late enrollment writes', async () => {
    const a = await account('synthetic-a');
    const old = await operation(a, '111');
    await apply(old);
    await apply(await operation(a, '222'));
    await apply(await operation(a, '111'));
    expect(await AcademicRaBindingModel.countDocuments()).toBe(3);
    const result = await upsertEnrollment(
      {
        ra: 111,
        sourceOperationId: old.operationId,
        recordKey: 'late',
        year: 2025,
        quad: 1,
        disciplina: 'Late',
      },
      { warn() {} } as never
    );
    expect(result).toBeNull();
    expect((await visible(a)).filter((row) => row.active)).toHaveLength(1);
    expect((await visible(a)).filter((row) => row.ra === 111)).toHaveLength(2);
  });

  it('rejects an old callback and a mismatched session before ownership changes', async () => {
    const a = await account('synthetic-a');
    const old = await operation(a, '111');
    await apply(await operation(a, '222'));
    expect((await apply(old))?.status).toBe('rejected');
    const wrong = await operation(a, '333');
    expect(
      (
        await applyVerifiedAcademicSync(
          wrong.operationId,
          { login: 'someone-else', ra: '333' },
          'fixture',
          async () => {}
        )
      )?.status
    ).toBe('rejected');
    expect((await visible(a)).map((row) => row.ra)).toEqual([222]);
  });

  it('replays safely and rejects changed payloads', async () => {
    const a = await account('synthetic-a');
    const op = await operation(a, '111');
    await apply(op);
    await apply(op);
    expect(await EnrollmentModel.countDocuments()).toBe(1);
    expect(
      (
        await applyVerifiedAcademicSync(
          op.operationId,
          { login: op.expectedLogin, ra: op.ra },
          'different',
          async () => {}
        )
      )?.status
    ).toBe('rejected');
  });

  it('rolls back closure and account changes when persistence fails', async () => {
    const a = await account('synthetic-a');
    await apply(await operation(a, '111'));
    const op = await operation(a, '222');
    await expect(
      applyVerifiedAcademicSync(
        op.operationId,
        { login: op.expectedLogin, ra: op.ra },
        'fixture',
        async () => {
          throw new Error('fixture failure');
        }
      )
    ).rejects.toThrow('fixture failure');
    expect((await UserModel.findById(a._id))?.ra).toBe(111);
    expect((await visible(a))[0].active).toBe(true);
  });

  it('allows only one holder in concurrent claims', async () => {
    const a = await account('synthetic-a');
    const b = await account('synthetic-b');
    const ops = [await operation(a, '111'), await operation(b, '111')];
    const results = await Promise.allSettled(ops.map(apply));
    expect(
      results.filter(
        (result) =>
          result.status === 'fulfilled' && result.value?.status === 'applied'
      )
    ).toHaveLength(1);
    expect(
      await AcademicRaBindingModel.countDocuments({
        status: 'current',
        ra: '111',
      })
    ).toBe(1);
  });

  it('migrates only reviewed IDs, is idempotent and leaves unresolved rows inaccessible', async () => {
    const a = await account('synthetic-a');
    const rows = await EnrollmentModel.create([
      { ra: 111, year: 2020, quad: 1, disciplina: 'Reviewed', active: false },
      { ra: 111, year: 2020, quad: 1, disciplina: 'Ambiguous', active: false },
    ]);
    const manifest = {
      entries: [
        {
          userId: a._id.toString(),
          ra: '111',
          evidenceRef: 'synthetic-evidence',
          records: [{ collection: 'enrollments', id: rows[0]._id.toString() }],
        },
      ],
    };
    expect((await migrateAcademicOwnership(manifest)).applied).toBe(false);
    expect(await AcademicIdentityModel.countDocuments()).toBe(0);
    await migrateAcademicOwnership(manifest, true);
    await migrateAcademicOwnership(manifest, true);
    expect(await visible(a)).toHaveLength(1);
    expect((await visible(a))[0].active).toBe(false);
    const b = await account('synthetic-b');
    await expect(
      migrateAcademicOwnership(
        { entries: [{ ...manifest.entries[0], userId: b._id.toString() }] },
        true
      )
    ).rejects.toThrow('overwrite existing ownership');
    expect(await visible(b)).toHaveLength(0);
  });
});
