import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { PERMISSIONS } from '@/constants.js';
import { permissionVerifyHook } from '@/hooks/permission-verify.js';
import {
  archiveDownloadResponseSchema,
  archiveListQuerySchema,
  archiveListResponseSchema,
  archiveParamsSchema,
  componentPlanResponseSchema,
  planParamsSchema,
} from '@/schemas/v2/archives.js';
import { ArchiveMonitoringService } from '@/services/archive-monitoring-service.js';

const ARCHIVE_READERS = [PERMISSIONS.ADMIN, PERMISSIONS.ARCHIVES];

export const archivesController: FastifyPluginAsyncZod = async (app) => {
  const preHandler = [permissionVerifyHook(ARCHIVE_READERS)];

  function createService(globalTraceId: string) {
    return new ArchiveMonitoringService({
      bucket: app.config.AWS_BUCKET,
      globalTraceId,
      storageConnector: app.aws.s3,
    });
  }

  app.route({
    handler: async (request) =>
      await createService(request.id).listArchives(request.query),
    method: 'GET',
    preHandler,
    schema: {
      querystring: archiveListQuerySchema,
      response: { 200: archiveListResponseSchema },
    },
    url: '/archives',
  });

  app.route({
    handler: async (request) =>
      await createService(request.id).createDownloadUrl(
        request.params.archiveId
      ),
    method: 'GET',
    preHandler,
    schema: {
      params: archiveParamsSchema,
      response: { 200: archiveDownloadResponseSchema },
    },
    url: '/archives/:archiveId/download',
  });

  app.route({
    handler: async (request) =>
      await createService(request.id).findLatestPlan(
        request.params.componentId
      ),
    method: 'GET',
    preHandler,
    schema: {
      params: planParamsSchema,
      response: { 200: componentPlanResponseSchema },
    },
    url: '/components/:componentId/plan',
  });
};
