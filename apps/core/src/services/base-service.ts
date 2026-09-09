import type { Logger } from 'pino';

import { getClassLogger, getRequestTraceId } from '@/utils/logger.js';

export type BaseServiceOptions = {
  traceId?: string;
};

export abstract class BaseService {
  protected readonly traceId: string;
  protected readonly logger: Logger;

  constructor({ traceId }: BaseServiceOptions = {}) {
    this.traceId = traceId ?? getRequestTraceId();
    this.logger = getClassLogger(this, { traceId: this.traceId });
  }
}
