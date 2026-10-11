import { Schema, model } from 'mongoose';

export const AcademicIdentityModel = model(
  'academic_identities',
  new Schema(
    {
      // Account recovery must preserve this identity; RA/email never merge identities.
      createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    },
    { timestamps: true }
  )
);

const bindingSchema = new Schema(
  {
    ownerIdentityId: {
      type: Schema.Types.ObjectId,
      ref: 'academic_identities',
      required: true,
      immutable: true,
    },
    institution: {
      type: String,
      required: true,
      default: 'ufabc',
      immutable: true,
    },
    ra: { type: String, required: true, immutable: true },
    status: { type: String, enum: ['current', 'closed'], required: true },
    // Unknown effective dates remain null. recordedAt is not an effective date.
    validFrom: { type: Date, default: null },
    validTo: { type: Date, default: null },
    verifiedAt: { type: Date, required: true },
    closedAt: { type: Date, default: null },
    evidenceRef: { type: String, required: true, unique: true },
    revision: { type: Number, default: 0 },
    latestOperationId: String,
  },
  { timestamps: true }
);
bindingSchema.index(
  { institution: 1, ra: 1 },
  { unique: true, partialFilterExpression: { status: 'current' } }
);
bindingSchema.index(
  { ownerIdentityId: 1 },
  { unique: true, partialFilterExpression: { status: 'current' } }
);
export const AcademicRaBindingModel = model(
  'academic_ra_bindings',
  bindingSchema
);

const operationSchema = new Schema(
  {
    operationId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    expectedLogin: { type: String, required: true },
    ra: { type: String, required: true },
    status: {
      type: String,
      enum: ['awaiting', 'applied', 'failed', 'conflict', 'rejected'],
      default: 'awaiting',
    },
    ownerIdentityId: Schema.Types.ObjectId,
    academicBindingId: Schema.Types.ObjectId,
    reason: String,
    payloadHash: String,
    credentialHash: { type: String, index: true },
    credentialExpiresAt: Date,
  },
  { timestamps: true }
);
export const AcademicSyncOperationModel = model(
  'academic_sync_operations',
  operationSchema
);

// Events lacking identity proof are retained for explicit resolution, never assigned by RA.
export const AcademicPendingEventModel = model(
  'academic_pending_events',
  new Schema(
    {
      deliveryId: { type: String, required: true, unique: true },
      reason: { type: String, required: true },
      payload: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
  )
);
