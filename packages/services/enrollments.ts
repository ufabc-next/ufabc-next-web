import { Concept } from 'types';

import api from './api';

type EnrollmentTeacherComment = {
  _id: string;
  comment: string;
  viewers: number;
  enrollment: string;
  type: string;
  ra: string;
  active: boolean;
  teacher: string;
  subject: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
};

type EnrollmentTeacher = {
  _id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
  comment?: EnrollmentTeacherComment;
};

export type Subject = {
  _id: string;
  name: string;
  search: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
  creditos: number;
};

export type Enrollment = {
  _id: string;
  pratica?: EnrollmentTeacher | null;
  teoria?: EnrollmentTeacher | null;
  updatedAt: string;
  conceito: Concept;
  creditos: number;
  disciplina: string;
  quad: number;
  subject: Subject;
  year: number;
  comments?: string[];
};

export const Enrollments = {
  list: () => api.get<Enrollment[]>('/enrollments'),
  get: (id: string) => api.get<Enrollment>('/enrollments/' + id),
};
