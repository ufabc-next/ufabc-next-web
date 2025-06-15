import { Enrollment } from 'types';

import { api } from './api.ts';

export const Enrollments = {
  list: () => api.get<Enrollment[]>('/entities/enrollments'),
  get: (id: string) => api.get<Enrollment>(`/entities/enrollments/${id}`),
};
