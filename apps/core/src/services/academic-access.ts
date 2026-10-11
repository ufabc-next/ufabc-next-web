import { Types } from 'mongoose';

import { AcademicRaBindingModel } from '@/models/AcademicIdentity.js';
import { UserModel } from '@/models/User.js';

export async function academicAccessFilter(userId: string, current = false) {
  const user = Types.ObjectId.isValid(userId)
    ? await UserModel.findById(userId).lean()
    : null;
  // Explicitly impossible filter. Missing ownership must never match null legacy owners.
  if (!user?.active || !user.academicIdentityId)
    return {
      ownerIdentityId: new Types.ObjectId('000000000000000000000000'),
      ownershipStatus: 'confirmed' as const,
      academicBindingId: { $in: [] as Types.ObjectId[] },
    };
  const bindings = await AcademicRaBindingModel.find({
    ownerIdentityId: user.academicIdentityId,
    ...(current ? { status: 'current' } : {}),
  })
    .select('_id')
    .lean();
  return {
    ownerIdentityId: user.academicIdentityId,
    ownershipStatus: 'confirmed' as const,
    academicBindingId: { $in: bindings.map((binding) => binding._id) },
  };
}
