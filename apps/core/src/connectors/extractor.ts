import { UnrecoverableError } from 'bullmq';
import { z } from 'zod';

import type { Config } from '@/plugins/external/config.js';

import { BaseRequester } from './base-requester.js';

const extractionSchema = z.object({
  cronograma: z.array(z.object({ aula: z.string(), data: z.string() })),
  planejamento: z.object({
    avaliacao: z.string(),
    ementa: z.string(),
    metodologia: z.string(),
    objetivos: z.string(),
  }),
});

const summarySchema = z.object({
  didactic_quality: z.number().min(0).max(5).nullable(),
  model: z.string(),
  prompt_version: z.string(),
  summary: z.string(),
  takes_attendance: z.boolean().nullable(),
  uses_moodle: z.boolean().nullable(),
  uses_sigaa: z.boolean().nullable(),
});

export type ArchiveExtraction = z.infer<typeof extractionSchema>;
export type CommentsSummary = z.infer<typeof summarySchema>;

/**
 * Stateless AI extractor (ufabc-next-ai). It never touches our database:
 * we send the input, it returns structured data, and we persist it.
 */
export class ExtractorConnector extends BaseRequester {
  // Bodies carry presigned URLs and student comments, so they never reach the logs.
  protected override readonly redactRequestBody = true;

  constructor(
    baseUrl: string,
    private readonly token: string,
    globalTraceId?: string
  ) {
    super(baseUrl, globalTraceId);
  }

  async extractArchive(pdfUrl: string) {
    const response = await this.request('/extract', {
      body: { pdfUrl },
      headers: { 'x-service-token': this.token },
      method: 'POST',
    });
    return extractionSchema.parse(response);
  }

  async summarizeComments(comments: string[]) {
    const response = await this.request('/summarize', {
      body: { comments },
      headers: { 'x-service-token': this.token },
      method: 'POST',
    });
    return summarySchema.parse(response);
  }
}

export function createExtractorConnector(
  config: Pick<Config, 'EXTRACTOR_TOKEN' | 'EXTRACTOR_URL'>,
  globalTraceId?: string
) {
  if (!config.EXTRACTOR_URL || !config.EXTRACTOR_TOKEN) {
    throw new UnrecoverableError('EXTRACTOR_URL and EXTRACTOR_TOKEN must be set');
  }
  return new ExtractorConnector(
    config.EXTRACTOR_URL,
    config.EXTRACTOR_TOKEN,
    globalTraceId
  );
}
