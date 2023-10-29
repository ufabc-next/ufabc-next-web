import type {
  CourseName,
  PageableReturn,
  StatsClass,
  StatsCourse,
  StatsSubject,
} from 'types';
import api from './api';

export type StatsParams = {
  page: number;
  deficit?: 1;
  vagas?: 1;
  ratio?: 1;
  requisicoes?: 1;
  turno?: 'diurno' | 'noturno';
  season: string;
};

export const StatsSubjects = {
  getAllClasses: (params: StatsParams) =>
    api.get<PageableReturn<StatsClass>>('/stats/disciplinas', { params }),
  getAllCourses: (params: StatsParams) =>
    api.get<PageableReturn<StatsCourse>>('/stats/disciplinas/courses', {
      params,
    }),
  getAllSubjects: (params: StatsParams) =>
    api.get<PageableReturn<StatsSubject>>('/stats/disciplinas/disciplines', {
      params,
    }),
  getAllCoursesNames: () => api.get<CourseName[]>('/histories/courses'),
};
