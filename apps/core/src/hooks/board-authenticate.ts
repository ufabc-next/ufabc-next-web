// @ts-nocheck - Fastify types are not compatible with the BoardAuthHook type
import type { BoardAuthHook } from '@next/queues/manager';

const BOARD_COOKIE_MAX_AGE_SECONDS = 3600;

export const authenticateBoard: BoardAuthHook = async (request, reply) => {
  if (request.server.config.NODE_ENV === 'dev') {
    request.log.info('Skipping board authentication in development mode');
    return;
  }

  const { token: queryToken } = request.query as { token?: string };
  const token = queryToken ?? request.cookies.token;

  if (!token) {
    return reply
      .status(401)
      .send({ error: 'Unauthorized', message: 'No token provided' });
  }

  let user;
  try {
    user = request.server.jwt.verify(token);
  } catch {
    request.log.warn('Board access denied: invalid token');
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  if (!user.permissions?.includes('admin')) {
    request.log.warn({ userId: user._id }, 'Board access denied: not an admin');
    return reply.status(403).send({ error: 'Forbidden' });
  }

  if (queryToken) {
    // move the token from the url into a cookie scoped to the board
    const requestPath = request.url.split('?')[0];
    const boardPath = requestPath.endsWith('/') ? requestPath : `${requestPath}/`;
    reply.setCookie('token', queryToken, {
      path: boardPath,
      secure: request.server.config.NODE_ENV === 'prod',
      httpOnly: true,
      maxAge: BOARD_COOKIE_MAX_AGE_SECONDS,
      sameSite: 'lax',
    });
    return reply.redirect(boardPath, 303);
  }
};
