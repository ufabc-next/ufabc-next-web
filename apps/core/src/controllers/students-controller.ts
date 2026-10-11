import { currentQuad } from '@next/utils';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { sigaaSession } from '@/hooks/sigaa-session.js';
import { StudentModel } from '@/models/Student.js';
import { academicAccessFilter } from '@/services/academic-access.js';
import {
  authenticateAcademicRequest,
  findAcademicCredential,
} from '@/services/academic-credential.js';
import { syncStudentFromSigaa } from '@/services/sigaa-student-sync.js';

export const studentsController: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/students/sigaa/status',
    {
      schema: {
        headers: z.object({ 'x-academic-token': z.string() }),
        response: {
          200: z.object({
            operationId: z.string(),
            status: z.enum([
              'awaiting',
              'applied',
              'failed',
              'conflict',
              'rejected',
            ]),
          }),
        },
      },
    },
    async (request, reply) => {
      reply.header('Cache-Control', 'no-store');
      const operation = await findAcademicCredential(
        request.headers['x-academic-token']
      );
      if (!operation) return reply.unauthorized();
      // An older tab must not save a capability revoked by a newer sync.
      if (operation.status === 'applied') {
        await authenticateAcademicRequest(request);
      }
      return { operationId: operation.operationId, status: operation.status! };
    }
  );
  app.route({
    handler: async (request, reply) => {
      const season = currentQuad();
      const { login, studentId, graduationId } = request.body;

      const updated = await StudentModel.findOneAndUpdate(
        {
          ...(await academicAccessFilter(request.user._id, true)),
          login: login.trim().toLowerCase(),
          season,
          active: { $ne: false },
        },
        {
          $set: {
            aluno_id: studentId,
            'cursos.$[].id_curso': graduationId,
          },
        }
      );
      if (!updated) return reply.notFound();
      return await reply.send({ message: 'Student updated successfully' });
    },
    method: 'PUT',
    preHandler: [authenticateAcademicRequest],
    schema: {
      body: z.object({
        graduationId: z.number(),
        login: z.string(),
        studentId: z.number(),
      }),
      headers: z.object({
        'session-id': z.string().optional(),
        'x-academic-token': z.string().optional(),
        authorization: z.string().optional(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
    url: '/students',
  });

  app.route({
    handler: async (request, reply) => {
      const season = currentQuad();
      const [student] = await StudentModel.find({
        ...(await academicAccessFilter(request.user._id, true)),
        login: request.headers.login.trim().toLowerCase(),
        season,
        active: { $ne: false },
      });

      if (!student) {
        return await reply.notFound();
      }

      const response = student.cursos.map((graduation) => ({
        affinity: graduation.ind_afinidade,
        ca: graduation.ca,
        cp: graduation.cp,
        cr: graduation.cr,
        name: graduation.nome_curso,
        shift: graduation.turno,
      }));

      return await reply.send({
        graduations: response,
        ra: student.ra,
      });
    },
    method: 'GET',
    preHandler: [authenticateAcademicRequest],
    schema: {
      headers: z.object({
        login: z.string(),
        'session-id': z.string().optional(),
        'x-academic-token': z.string().optional(),
        authorization: z.string().optional(),
      }),
      response: {
        200: z.object({
          graduations: z
            .object({
              affinity: z.number().nullable(),
              ca: z.number().optional().nullable(),
              cp: z.number().optional().nullable(),
              cr: z.number().optional().nullable(),
              name: z.string(),
              shift: z.enum([
                'Noturno',
                'Matutino',
                'noturno',
                'matutino',
                'n',
                'm',
              ]),
            })
            .array(),
          ra: z.number().int().positive().safe(),
        }),
      },
    },
    url: '/students',
  });

  app.route({
    handler: async (request, reply) => {
      const { ra, login } = request.body;
      const { sessionId, viewId } = request.sigaaSession;

      const result = await syncStudentFromSigaa(
        app,
        { ra, login },
        { sessionId, viewId },
        request.id
      );

      if (result.status === 'not_found') {
        return reply.notFound(result.message);
      }

      reply.header('Cache-Control', 'no-store');
      return reply.status(202).send(result);
    },
    method: 'POST',
    url: '/students/sigaa',
    schema: {
      headers: z.object({
        'session-id': z.string(),
        'view-id': z.string(),
      }),
      body: z.object({
        ra: z.number(),
        login: z.string(),
      }),
      response: {
        202: z.object({
          status: z.string(),
          data: z.any(),
        }),
      },
    },
    preHandler: [sigaaSession],
  });
};

export default studentsController;
