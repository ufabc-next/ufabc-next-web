import { currentQuad } from '@next/utils';
import type { FastifyPluginAsyncZodOpenApi } from 'fastify-zod-openapi';

import { listUserEnrollments } from '@/schemas/entities/enrollments.js';

import {
  findComment,
  findOne,
  listByUser,
  listWithComponents,
} from './service.js';

const plugin: FastifyPluginAsyncZodOpenApi = async (app) => {
  app.get('/', { schema: listUserEnrollments }, async ({ user }) => {
    const userEnrollments = await listByUser(user._id);
    return userEnrollments;
  });

  app.get('/wpp', async ({ user, query }, reply) => {
    const { season } = query as {
      season: ReturnType<typeof currentQuad>;
      ra: string;
    };

    const actualSeason = season ?? currentQuad();

    const wppEnrollments = await listWithComponents(user._id, actualSeason);
    return wppEnrollments;
  });

  app.get('/:enrollmentId', async (request, reply) => {
    const { enrollmentId } = request.params as { enrollmentId: string };
    const enrollment = await findOne(enrollmentId, request.user._id);

    if (!enrollment) {
      return reply.badRequest('Enrollment not found');
    }

    const comments = await findComment(enrollmentId);

    if (!comments) {
      return reply.badRequest('No comments were found');
    }

    comments.forEach((c) => {
      // @ts-expect-error for now
      enrollment[c.type].comment = c;
    });

    const { ra, ...res } = enrollment;
    return res;
  });
};

export default plugin;
