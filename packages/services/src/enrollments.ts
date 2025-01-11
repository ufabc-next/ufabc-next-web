import { api } from './api';

import { Enrollment } from '@/types';

export const Enrollments = {
  list: () => api.get<Enrollment[]>('/entities/enrollments'),
  get: (id: string) => api.get<Enrollment>(`/entities/enrollments/${id}`),
};
