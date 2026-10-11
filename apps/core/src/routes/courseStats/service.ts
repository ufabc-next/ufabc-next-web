import { lastQuad } from '@next/utils';

import { GraduationModel } from '@/models/Graduation.js';
import type { Graduation } from '@/models/Graduation.js';
import { GraduationHistoryModel } from '@/models/GraduationHistory.js';
import { HistoryModel } from '@/models/History.js';
import { academicAccessFilter } from '@/services/academic-access.js';

export async function getCrDistribution(points: number, interval: number) {
  const { year, quad } = lastQuad();
  const coefficientsKey = `coefficients.${year}.${quad}`;

  const pipeline: any = [
    {
      $match: {
        active: { $ne: false },
        [coefficientsKey]: { $exists: true },
      },
    },
    { $project: { value: `$${coefficientsKey}` } },
    {
      $group: {
        _id: createDistributionGroup(points, interval),
        total: { $sum: 1 },
        point: { $avg: '$value.cr_acumulado' },
      },
    },
    {
      $sort: { point: 1 },
    },
  ];

  const distribution = await HistoryModel.aggregate(pipeline);

  return distribution;
}

export async function findLatestHistory(userId: string) {
  const lastHistory = await HistoryModel.findOne({
    ...(await academicAccessFilter(userId)),
    disciplinas: { $ne: [] },
  }).sort({ active: -1, updatedAt: -1 });

  return lastHistory;
}

export async function findOneGraduation(grade: string, curso: string) {
  const graduation = await GraduationModel.findOne({
    curso,
    grade,
  }).lean<Graduation>();

  return graduation;
}

export async function getGraduationHistory(userId: string) {
  const history = await GraduationHistoryModel.find({
    ...(await academicAccessFilter(userId)),
  })
    .sort({ active: -1, updatedAt: -1 })
    .lean();

  return history;
}

function createDistributionGroup(totalPoints: number, inc: number) {
  // i still dont know what this code serves for
  const branches = [...Array.from({ length: totalPoints }).keys()].map((k) => ({
    case: {
      // select where the cr_acumulado is less than inc * k
      $lt: ['$value.cr_acumulado', inc * k],
    },
    then: inc * k,
  }));

  return {
    $switch: {
      branches,
      default: inc * totalPoints,
    },
  };
}
