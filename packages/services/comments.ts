
import { Comment } from 'types';
import api from './api';

export type GetCommentResponse = {
  data: Comment[];
  total: number;
};

export type CreateCommentRequest = {
  comment: string,
  enrollment: string,
  type: string
};

type CommentResponse = {
  _id: string;
  comment: string;
  createdAt: string;
  enrollment: { _id: string; };
  subject: string;
  teacher: string;
  updatedAt: string;
}

export type CreateCommentResponse = CommentResponse

export type UpdateCommentRequest = {
  id: string;
  comment: string;
};

export type UpdateCommentResponse = CommentResponse

const comment = {
  get: async (teacherId: string, subjectId: string, pageParam = 0) =>
    api.get<GetCommentResponse>(`/comments/${teacherId}/${subjectId}`, {
      params: { page: pageParam, limit: 10 },
    }),
  getUserComment: async (enrollmentId: string) => api.get<Comment>(`/comments/enrollment/${enrollmentId}`),
  create: async (data: CreateCommentRequest) => api.post('/comments/', data),
  update: async ({ id, comment }: UpdateCommentRequest) =>
    api.put('/comments/' + id, { comment }),
  like: async (id: string) => api.post(`/reactions/${id}`, { kind: 'like' }),
  recommendation: async (id: string) =>
    api.post(`/reactions/${id}`, { kind: 'recommendation' }),
  removeLike: async (id: string) => api.delete(`/reactions/${id}/like`),
  removeRecommendation: async (id: string) =>
    api.delete(`/reactions/${id}/recommendation`),
};

export default comment;
