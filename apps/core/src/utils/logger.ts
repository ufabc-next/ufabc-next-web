import { requestContext } from '@fastify/request-context'
import { createServerLogger } from '@next/logger/server'
import { randomUUID } from 'node:crypto'
import type { Logger } from 'pino'

const env = process.env.NODE_ENV === 'production' ? 'production' : 'dev'

export const logger = createServerLogger(env, process.env.LOG_LEVEL)

/**
 * Binds a child logger to the calling instance's class name, similar to
 * Python's `getLogger(__name__)` or the JVM's
 * `LoggerFactory.getLogger(MyClass.class)` — every log line is tagged with
 * the concrete class that emitted it (e.g. "SigaaConnector",
 * "S3Connector"), inferred automatically instead of a hardcoded string.
 */
export function getClassLogger(
  instance: object,
  bindings: Record<string, unknown> = {}
): Logger {
  return logger.child({ component: instance.constructor.name, ...bindings })
}

export function getRequestTraceId(): string {
  return requestContext.get('traceId') ?? randomUUID()
}
