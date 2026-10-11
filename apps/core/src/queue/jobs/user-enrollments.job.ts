import { createHash } from 'node:crypto';

import { AcademicPendingEventModel } from '@/models/AcademicIdentity.js';
import type { History } from '@/models/History.js';

import type { QueueContext } from '../types.js';

export async function userEnrollmentsUpdate(
  ctx: QueueContext<History | undefined>
) {
  await retainLegacyAcademicEvent('history', ctx.job.data);
}
export async function processComponentEnrollment(ctx: QueueContext<unknown>) {
  await retainLegacyAcademicEvent('enrollment', ctx.job.data);
}
async function retainLegacyAcademicEvent(kind: string, payload: unknown) {
  if (payload === undefined) return;
  const deliveryId =
    'legacy:' +
    kind +
    ':' +
    createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  await AcademicPendingEventModel.updateOne(
    { deliveryId },
    { $setOnInsert: { reason: 'legacy_missing_provenance', payload } },
    { upsert: true }
  );
}
