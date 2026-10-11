import { Schema, type Types } from 'mongoose';

export type AcademicOwnership = {
  ownerIdentityId?: Types.ObjectId | null;
  academicBindingId?: Types.ObjectId | null;
  ownershipStatus?: 'confirmed' | 'unresolved';
  sourceOperationId?: string | null;
  recordKey?: string | null;
};

export const academicOwnershipFields = {
  ownerIdentityId: {
    type: Schema.Types.ObjectId,
    ref: 'academic_identities',
    default: null,
    immutable: true,
  },
  academicBindingId: {
    type: Schema.Types.ObjectId,
    ref: 'academic_ra_bindings',
    default: null,
    immutable: true,
  },
  ownershipStatus: {
    type: String,
    enum: ['confirmed', 'unresolved'],
    default: 'unresolved',
  },
  sourceOperationId: { type: String, default: null },
  recordKey: { type: String, default: null },
} as const;

export function addAcademicOwnershipIndexes(schema: Schema) {
  schema.index({ ownerIdentityId: 1, academicBindingId: 1 });
  schema.index(
    { academicBindingId: 1, recordKey: 1 },
    {
      unique: true,
      partialFilterExpression: {
        ownershipStatus: 'confirmed',
        recordKey: { $type: 'string' },
      },
    }
  );
}
