import api from '@/utils/api';

export type Concept = 'A' | 'B' | 'C' | 'D' | 'F' | 'O';

type EnrollmentTeacher = {
  _id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
};

type Subject = {
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
  pratica?: EnrollmentTeacher;
  teoria?: EnrollmentTeacher;
  updatedAt: string;
  conceito: Concept;
  creditos: number;
  disciplina: string;
  quad: number;
  subject: Subject;
  year: number;
};

const enrollment = {
  list: () => api.get<Enrollment[]>('/enrollments'),
  get: (id: string | number) => api.get<Enrollment>('/enrollments/' + id),
};

export default enrollment;
