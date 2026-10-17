import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SummaryGenerationService } from '../../src/services/summary-generation-service.js';

const mocks = vi.hoisted(() => ({
  countComments: vi.fn(),
  findLatestSummary: vi.fn(),
}));

vi.mock('../../src/connectors/extractor.js', () => ({
  ExtractorConnector: vi.fn(() => ({})),
}));
vi.mock('../../src/models/Comment.js', () => ({
  CommentModel: { countDocuments: mocks.countComments },
}));
vi.mock('../../src/models/Summary.js', () => ({
  SummaryModel: {
    findOne: () => ({
      sort: () => ({
        select: () => ({ lean: mocks.findLatestSummary }),
      }),
    }),
  },
}));

const teacherId = '507f1f77bcf86cd799439011';

function buildService() {
  return new SummaryGenerationService({ config: {} as never });
}

describe('SummaryGenerationService.hasEnoughNewComments', () => {
  beforeEach(() => {
    mocks.countComments.mockReset();
    mocks.findLatestSummary.mockReset();
  });

  it('counts only comments newer than the latest summary', async () => {
    const newestComment = new Date('2026-10-01');
    mocks.findLatestSummary.mockResolvedValue({ newestComment });
    mocks.countComments.mockResolvedValue(4);

    expect(await buildService().hasEnoughNewComments(teacherId)).toBe(false);
    expect(mocks.countComments).toHaveBeenCalledWith(
      expect.objectContaining({ createdAt: { $gt: newestComment } })
    );
  });

  it('triggers at the threshold, counting every comment when no summary exists', async () => {
    mocks.findLatestSummary.mockResolvedValue(null);
    mocks.countComments.mockResolvedValue(5);

    expect(await buildService().hasEnoughNewComments(teacherId)).toBe(true);
    expect(mocks.countComments.mock.calls[0][0]).not.toHaveProperty('createdAt');
  });
});
