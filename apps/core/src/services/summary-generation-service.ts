import { UnrecoverableError } from 'bullmq';
import type { FastifyInstance } from 'fastify';
import { Types } from 'mongoose';

import { ExtractorConnector } from '@/connectors/extractor.js';
import {
  SUMMARY_BATCH_SIZE,
  SUMMARY_MAX_COMMENTS,
  SUMMARY_MAX_COMMENT_CHARS,
  SUMMARY_MIN_COMMENTS,
} from '@/constants.js';
import { CommentModel } from '@/models/Comment.js';
import { SummaryModel } from '@/models/Summary.js';
import { summarySchema } from '@/schemas/v2/extractor.js';

import { BaseService } from './base-service.js';

type SummaryGenerationDependencies = {
  config: FastifyInstance['config'];
  globalTraceId?: string;
};

export class SummaryGenerationService extends BaseService {
  private readonly extractorConnector: ExtractorConnector;
  private readonly promptVersion: string;

  constructor({ config, globalTraceId }: SummaryGenerationDependencies) {
    super({ globalTraceId });
    this.extractorConnector = new ExtractorConnector({
      baseUrl: config.EXTRACTOR_URL,
      globalTraceId: this.globalTraceId,
      internalToken: config.INTERNAL_TOKEN,
      token: config.SERVICE_HEADER,
    });
    this.promptVersion = config.SUMMARY_PROMPT_VERSION;
  }

  async findTeacherIdsToSummarize() {
    const rows = await CommentModel.aggregate<{ _id: Types.ObjectId }>([
      { $match: { active: true } },
      {
        $group: {
          _id: '$teacher',
          count: { $sum: 1 },
          newestComment: { $max: '$createdAt' },
        },
      },
      { $match: { count: { $gte: SUMMARY_MIN_COMMENTS } } },
      {
        $lookup: {
          as: 'latestSummary',
          from: 'summaries',
          let: { teacherId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$teacher', '$$teacherId'] },
                status: 'active',
                subject: null,
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
        },
      },
      {
        $match: {
          $or: [
            { latestSummary: { $size: 0 } },
            {
              $expr: {
                $gt: [
                  '$newestComment',
                  { $arrayElemAt: ['$latestSummary.newestComment', 0] },
                ],
              },
            },
            {
              $expr: {
                $ne: [
                  { $arrayElemAt: ['$latestSummary.promptVersion', 0] },
                  this.promptVersion,
                ],
              },
            },
          ],
        },
      },
      { $sort: { newestComment: 1 } },
      { $limit: SUMMARY_BATCH_SIZE },
    ]);

    const teacherIds: string[] = [];
    for (const row of rows) {
      teacherIds.push(row._id.toString());
    }
    return teacherIds;
  }

  async generateSummary(teacherId: string) {
    const comments = await CommentModel.find(
      { active: true, teacher: new Types.ObjectId(teacherId) },
      { comment: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(SUMMARY_MAX_COMMENTS)
      .lean<Array<{ comment: string; createdAt: Date }>>();

    if (comments.length === 0) {
      throw new UnrecoverableError(
        `No active comments for teacher ${teacherId}`
      );
    }

    const commentTexts: string[] = [];
    const commentDates: Date[] = [];
    for (const comment of comments) {
      commentTexts.push(comment.comment.slice(0, SUMMARY_MAX_COMMENT_CHARS));
      commentDates.push(comment.createdAt);
    }

    const rawSummary =
      await this.extractorConnector.summarizeComments(commentTexts);
    const result = summarySchema.parse(rawSummary);
    const timestamps = commentDates.map((date) => date.getTime());

    const summary = await SummaryModel.create({
      commentsCount: comments.length,
      didacticQuality: result.didactic_quality,
      model: result.model,
      newestComment: new Date(Math.max(...timestamps)),
      oldestComment: new Date(Math.min(...timestamps)),
      promptVersion: result.prompt_version,
      summary: result.summary,
      takesAttendance: result.takes_attendance,
      teacher: teacherId,
      usesMoodle: result.uses_moodle,
      usesSigaa: result.uses_sigaa,
    });

    this.logger.info(
      { commentsCount: comments.length, teacherId },
      'teacher summary stored'
    );

    return { summaryId: summary._id.toString(), teacherId };
  }
}
