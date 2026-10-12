import { defineJob } from '@next/queues/client';
import z from 'zod';

import { JOB_NAMES } from '@/constants.js';
import { SummaryGenerationService } from '@/services/summary-generation-service.js';

export const teacherSummaryScheduleJob = defineJob(
  JOB_NAMES.TEACHER_SUMMARY_SCHEDULE
)
  .input(z.object({}))
  .every('1 day')
  .handler(async ({ app }) => {
    const service = new SummaryGenerationService({ config: app.config });
    const teacherIds = await service.findTeacherIdsToSummarize();

    for (const teacherId of teacherIds) {
      await app.manager.dispatch(JOB_NAMES.TEACHER_SUMMARY, { teacherId });
    }

    return { dispatched: teacherIds.length };
  });

export const teacherSummaryJob = defineJob(JOB_NAMES.TEACHER_SUMMARY)
  .input(z.object({ teacherId: z.string() }))
  .concurrency(3)
  .handler(async ({ job, app }) => {
    const service = new SummaryGenerationService({ config: app.config });

    return await service.generateSummary(job.data.teacherId);
  });
