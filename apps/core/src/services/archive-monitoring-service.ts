import type { S3Connector } from '@/connectors/s3-connector.js';
import {
  ArchiveNotFound,
  ComponentPlanNotFound,
} from '@/errors/custom-errors.js';
import { ArchiveDownloadMapper } from '@/mappers/archive-download-mapper.js';
import { ComponentArchiveMapper } from '@/mappers/component-archive-mapper.js';
import { ComponentPlanMapper } from '@/mappers/component-plan-mapper.js';
import { ComponentArchivesRepository } from '@/repositories/component-archives-repository.js';
import type { ArchivePageFilter } from '@/repositories/component-archives-repository.js';
import { ComponentPlansRepository } from '@/repositories/component-plans-repository.js';

import type { BaseServiceOptions } from './base-service.js';
import { BaseService } from './base-service.js';

const DOWNLOAD_TTL_SECONDS = 300;

export type ArchiveMonitoringServiceOptions = BaseServiceOptions & {
  bucket: string;
  storageConnector: S3Connector;
};

export class ArchiveMonitoringService extends BaseService {
  private readonly archiveMapper = new ComponentArchiveMapper();
  private readonly downloadMapper = new ArchiveDownloadMapper();
  private readonly planMapper = new ComponentPlanMapper();
  private readonly archivesRepository: ComponentArchivesRepository;
  private readonly plansRepository: ComponentPlansRepository;
  private readonly bucket: string;
  private readonly storageConnector: S3Connector;

  constructor({
    bucket,
    storageConnector,
    ...options
  }: ArchiveMonitoringServiceOptions) {
    super(options);
    this.bucket = bucket;
    this.storageConnector = storageConnector;
    this.archivesRepository = new ComponentArchivesRepository({
      globalTraceId: this.globalTraceId,
    });
    this.plansRepository = new ComponentPlansRepository({
      globalTraceId: this.globalTraceId,
    });
  }

  async listArchives(filter: ArchivePageFilter) {
    const { items, total } = await this.archivesRepository.findPage(filter);

    const data = [];
    for (const archive of items) {
      data.push(this.archiveMapper.toResponse(archive));
    }

    return { data, limit: filter.limit, page: filter.page, total };
  }

  async createDownloadUrl(archiveId: string) {
    const archive = await this.archivesRepository.findById(archiveId);

    if (!archive || archive.status !== 'stored' || archive.s3_key == null) {
      throw new ArchiveNotFound();
    }

    const url = await this.storageConnector.getPresignedUrl(
      this.bucket,
      archive.s3_key,
      DOWNLOAD_TTL_SECONDS
    );

    return this.downloadMapper.toResponse(archive, {
      expiresInSeconds: DOWNLOAD_TTL_SECONDS,
      url,
    });
  }

  async findLatestPlan(componentId: string) {
    const plan = await this.plansRepository.findLatestByComponent(componentId);

    if (!plan) {
      throw new ComponentPlanNotFound(componentId);
    }

    return this.planMapper.toResponse(plan);
  }
}
