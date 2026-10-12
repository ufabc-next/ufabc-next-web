import { defineJob } from '@next/queues/client';
import z from 'zod';

import { createExtractorConnector } from '@/connectors/extractor.js';
import { UfabcParserConnector } from '@/connectors/ufabc-parser.js';
import { JOB_NAMES } from '@/constants.js';
import { ArchiveExtractionService } from '@/services/archive-extraction-service.js';

export const archiveExtractionJob = defineJob(JOB_NAMES.ARCHIVE_EXTRACTION)
  .input(
    z.object({
      archiveId: z.string(),
      globalTraceId: z.string().optional(),
    })
  )
  .concurrency(2)
  .handler(async ({ job, app }) => {
    const { archiveId, globalTraceId } = job.data;

    const service = new ArchiveExtractionService({
      bucket: app.config.AWS_BUCKET,
      extractor: createExtractorConnector(app.config, globalTraceId),
      globalTraceId,
      parser: new UfabcParserConnector(app.config, globalTraceId),
      s3Connector: app.aws.s3,
    });

    return await service.extractArchive(archiveId);
  });
