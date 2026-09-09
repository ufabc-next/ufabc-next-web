import type { Logger } from 'pino';

import { getClassLogger, getRequestTraceId } from '@/utils/logger.js';

export type BaseServiceOptions = {
  traceId?: string;
};

/**
 * Extend this for new route-backed services instead of exporting plain
 * functions. Gives every service a child logger tagged with its own class
 * name (via getClassLogger) and the request's traceId, so a single
 * request's logs across routes/services/connectors correlate in Axiom.
 * Pass `traceId` explicitly for background jobs or tests, where there's no
 * ambient request context.
 */
export abstract class BaseService {
  protected readonly traceId: string;
  protected readonly logger: Logger;

  constructor({ traceId }: BaseServiceOptions = {}) {
    this.traceId = traceId ?? getRequestTraceId();
    this.logger = getClassLogger(this, { traceId: this.traceId });
  }
}
