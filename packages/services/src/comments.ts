import { Comment } from 'types';

import api from './api';

type GetCommentResponse = {
  data: Comment[];
  total: number;
};

type CreateCommentRequest = {
  comment: string;
  enrollment: string;
  type: string;
};

type UpdateCommentRequest = {
  id: string;
  comment: string;
};

export const Comments = {
  get: (teacherId: string, subjectId: string, pageParam = 0) =>
    api.get<GetCommentResponse>(`/comments/${teacherId}/${subjectId}`, {
      params: { page: pageParam, limit: 10 },
    }),
  getUserComment: (enrollmentId: string) =>
    api.get<Comment>(`/comments/enrollment/${enrollmentId}`),
  create: (data: CreateCommentRequest) => api.post('/comments/', data),
  update: ({ id, comment }: UpdateCommentRequest) =>
    api.put('/comments/' + id, { comment }),
  like: (id: string) => api.post(`/reactions/${id}`, { kind: 'like' }),
  recommendation: (id: string) =>
    api.post(`/reactions/${id}`, { kind: 'recommendation' }),
  removeLike: (id: string) => api.delete(`/reactions/${id}/like`),
  removeRecommendation: (id: string) =>
    api.delete(`/reactions/${id}/recommendation`),
};
