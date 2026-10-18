type PlanSource = {
  extractedAt: Date;
  planning?: {
    assessment: string;
    methodology: string;
    objectives: string;
    syllabus: string;
  } | null;
  schedule: { date: string; lesson: string }[];
  timetable: string[];
};

export class ComponentPlanMapper {
  toResponse(plan: PlanSource) {
    const schedule = [];
    for (const entry of plan.schedule) {
      schedule.push({ date: entry.date, lesson: entry.lesson });
    }

    let planning = null;
    if (plan.planning) {
      planning = {
        assessment: plan.planning.assessment,
        methodology: plan.planning.methodology,
        objectives: plan.planning.objectives,
        syllabus: plan.planning.syllabus,
      };
    }

    return {
      extractedAt: plan.extractedAt.toISOString(),
      planning,
      schedule,
      timetable: [...plan.timetable],
    };
  }
}
