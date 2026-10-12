import { UnrecoverableError } from 'bullmq';

import type { ExtractorConnector } from '@/connectors/extractor.js';
import type { S3Connector } from '@/connectors/s3-connector.js';
import type { UfabcParserConnector } from '@/connectors/ufabc-parser.js';
import { ARCHIVE_PRESIGNED_URL_TTL_SECONDS } from '@/constants.js';
import { ComponentModel } from '@/models/Component.js';
import { ComponentArchiveModel } from '@/models/ComponentArchive.js';
import { ComponentMetadataModel } from '@/models/ComponentMetadata.js';

import { BaseService } from './base-service.js';

type ArchiveExtractionDependencies = {
  bucket: string;
  extractor: ExtractorConnector;
  globalTraceId?: string;
  parser: UfabcParserConnector;
  s3Connector: S3Connector;
};

export class ArchiveExtractionService extends BaseService {
  private readonly bucket: string;
  private readonly extractor: ExtractorConnector;
  private readonly parser: UfabcParserConnector;
  private readonly s3Connector: S3Connector;

  constructor(dependencies: ArchiveExtractionDependencies) {
    super({ globalTraceId: dependencies.globalTraceId });
    this.bucket = dependencies.bucket;
    this.extractor = dependencies.extractor;
    this.parser = dependencies.parser;
    this.s3Connector = dependencies.s3Connector;
  }

  async extractArchive(archiveId: string) {
    const archive = await ComponentArchiveModel.findById(archiveId).lean();

    if (!archive || archive.status !== 'stored' || !archive.s3_key) {
      throw new UnrecoverableError(`Archive ${archiveId} is not stored`);
    }

    const component = await ComponentModel.findById(archive.component).lean();

    if (!component) {
      throw new UnrecoverableError(
        `Component ${archive.component} of archive ${archiveId} not found`
      );
    }

    const parserComponents = await this.parser.getComponentByClassroomCode(
      component.season,
      component.uf_cod_turma
    );
    const parserComponent = parserComponents[0];

    if (!parserComponent) {
      throw new UnrecoverableError(
        `ufabc-parser has no component ${component.uf_cod_turma} for season ${component.season}`
      );
    }

    const pdfUrl = await this.s3Connector.getPresignedUrl(
      this.bucket,
      archive.s3_key,
      ARCHIVE_PRESIGNED_URL_TTL_SECONDS
    );
    const extraction = await this.extractor.extractArchive(pdfUrl);

    await ComponentMetadataModel.findOneAndUpdate(
      { 'metadata.source_file': archive.s3_key },
      {
        $set: {
          cronograma: extraction.cronograma,
          metadata: {
            component_code: parserComponent.ufClassroomCode,
            component_data: parserComponent,
            disciplina_id: parserComponent.ufComponentId,
            processed_at: new Date().toISOString(),
            source_file: archive.s3_key,
          },
          planejamento: extraction.planejamento,
        },
      },
      { upsert: true }
    );

    this.logger.info(
      { archiveId, cronogramaItems: extraction.cronograma.length },
      'archive extraction stored'
    );

    return { archiveId, cronogramaItems: extraction.cronograma.length };
  }
}
