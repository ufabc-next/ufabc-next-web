import { UnrecoverableError } from 'bullmq';
import type { FastifyInstance } from 'fastify';
import { Types } from 'mongoose';

import { ExtractorConnector } from '@/connectors/extractor.js';
import {
  SUMMARY_COMMENT_THRESHOLD,
  SUMMARY_MAX_COMMENTS,
  SUMMARY_MAX_COMMENT_CHARS,
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

  constructor({ config, globalTraceId }: SummaryGenerationDependencies) {
    super({ globalTraceId });
    this.extractorConnector = new ExtractorConnector({
      baseUrl: config.EXTRACTOR_URL,
      globalTraceId: this.globalTraceId,
      internalToken: config.INTERNAL_TOKEN,
      token: config.SERVICE_HEADER,
    });
  }

  async hasEnoughNewComments(teacherId: string) {
    const teacherObjectId = new Types.ObjectId(teacherId);

    const latestSummary = await SummaryModel.findOne({
      status: 'active',
      subject: null,
      teacher: teacherObjectId,
    })
      .sort({ createdAt: -1 })
      .select('newestComment')
      .lean();

    const filter: Record<string, unknown> = {
      active: true,
      teacher: teacherObjectId,
    };
    if (latestSummary) {
      filter.createdAt = { $gt: latestSummary.newestComment };
    }

    const newComments = await CommentModel.countDocuments(filter);
    return newComments >= SUMMARY_COMMENT_THRESHOLD;
  }

  async generateSummary(teacherId: string) {
    // several events can queue before the first summary lands; skip the rest
    if (!(await this.hasEnoughNewComments(teacherId))) {
      return { skipped: true, teacherId };
    }

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
