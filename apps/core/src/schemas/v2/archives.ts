import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z
  .string()
  .refine((value) => Types.ObjectId.isValid(value), {
    message: 'Invalid id',
  });

export const archiveListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
  source: z.enum(['moodle', 'manual', 'sigaa', 'cmcc']).optional(),
  status: z
    .enum(['created', 'downloaded', 'stored', 'failed', 'deleted'])
    .optional(),
});

export const archiveParamsSchema = z.object({ archiveId: objectIdSchema });
export const planParamsSchema = z.object({ componentId: objectIdSchema });

export const archiveListResponseSchema = z.object({
  data: z.array(z.any()),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
});

export const archiveDownloadResponseSchema = z.object({
  expiresInSeconds: z.number(),
  fileName: z.string().nullable(),
  url: z.string(),
});

export const componentPlanResponseSchema = z.object({
  extractedAt: z.string(),
  planning: z
    .object({
      assessment: z.string(),
      methodology: z.string(),
      objectives: z.string(),
      syllabus: z.string(),
    })
    .nullish(),
  schedule: z.array(z.object({ date: z.string(), lesson: z.string() })),
  timetable: z.array(z.string()),
});
