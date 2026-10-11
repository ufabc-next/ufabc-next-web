import {
  AcademicIdentityModel,
  AcademicRaBindingModel,
  AcademicSyncOperationModel,
  AcademicPendingEventModel,
} from '@/models/AcademicIdentity.js';
import { EnrollmentModel } from '@/models/Enrollment.js';
import { GraduationHistoryModel } from '@/models/GraduationHistory.js';
import { HistoryModel } from '@/models/History.js';
import { StudentModel } from '@/models/Student.js';

export async function ensureAcademicIndexes() {
  // Production disables autoIndex. These constraints must exist before accepting writes.
  for (const model of [
    AcademicIdentityModel,
    AcademicRaBindingModel,
    AcademicSyncOperationModel,
    AcademicPendingEventModel,
    StudentModel,
    EnrollmentModel,
    HistoryModel,
    GraduationHistoryModel,
  ]) {
    await model.createIndexes();
  }
}
