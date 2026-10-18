import { ComponentPlanModel } from '@/models/ComponentPlan.js';

import { BaseRepository } from './base-repository.js';
import type { BaseRepositoryOptions } from './base-repository.js';

export type ComponentPlansRepositoryOptions = BaseRepositoryOptions & {
  model?: typeof ComponentPlanModel;
};

export class ComponentPlansRepository extends BaseRepository {
  private readonly model: typeof ComponentPlanModel;

  constructor({ model, ...options }: ComponentPlansRepositoryOptions = {}) {
    super(options);
    this.model = model ?? ComponentPlanModel;
  }

  async findLatestByComponent(componentId: string) {
    this.logger.debug({ componentId }, 'Finding latest component plan');

    return await this.model
      .findOne({ component: componentId })
      .sort({ extractedAt: -1 })
      .lean();
  }
}
