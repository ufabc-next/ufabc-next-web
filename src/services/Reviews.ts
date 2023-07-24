import api from '@/utils/api';
import { TeacherReview } from '@/types/teacher';

export type SearchTeacherItem = {
  _id: string;
  name: string;
  updatedAt?: string;
  createdAt?: string;
  __v?: number;
  alias?: string[];
};

export type SearchTeacher = {
  data: SearchTeacherItem[];
  total: number;
};

export type SearchSubjectItem = {
  _id: string;
  name: string;
  search: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
  creditos: number;
};

export type SearchSubject = {
  data: SearchSubjectItem[];
  total: number;
};

const reviews = {
  searchTeachers: async (q: string) =>
    api.get<SearchTeacher>('/teachers/search', {
      params: { q },
    }),
  searchSubjects: async (q: string) =>
    api.get<SearchSubject>('/subjects/search', {
      params: { q },
    }),
  get: async (id: string) => api.get<TeacherReview>(`/reviews/teachers/${id}`),
};

export default reviews;
