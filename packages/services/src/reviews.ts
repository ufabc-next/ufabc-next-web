import {
  SearchSubject,
  SearchTeacher,
  SubjectInfo,
  TeacherReview,
} from 'types';

import { api } from './api.ts';

export const Reviews = {
  searchTeachers: async (q: string) =>
    api.get<SearchTeacher>('/entities/teachers/search', {
      params: { q },
    }),
  searchSubjects: async (q: string) =>
    api.get<SearchSubject>('/entities/subjects/search', {
      params: { q },
    }),
  getTeacher: async (id: string) =>
    api.get<TeacherReview>(`/entities/teachers/reviews/${id}`),
  getSubject: async (id: string) =>
    api.get<SubjectInfo>(`/entities/subjects/reviews/${id}`),
};
