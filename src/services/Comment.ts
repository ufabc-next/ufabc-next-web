import api from '@/utils/api';

import { Grade } from '@/types/grades';

export type Comment = {
  _id: string;
  comment: string;
  createdAt: string;
  enrollment: {
    _id: string;
    conceito: Grade;
    creditos: number;
    quad: number;
    year: number;
  };
  myReactions: {
    like: boolean;
    recommendation: boolean;
    star: boolean;
  };
  subject: {
    __v: number;
    _id: string;
    createdAt: string;
    creditos: number;
    name: string;
    search: string;
    updatedAt: string;
  };
  teacher: string;
  updatedAt: string;
};

export type GetCommentResponse = {
  data: Comment[];
  total: number;
};

const comments = {
  get: async (teacherId: string, subjectId: string, pageParam = 0) =>
    api.get<GetCommentResponse>(`/comments/${teacherId}/${subjectId}`, {
      params: { page: pageParam, limit: 10 },
    }),
  like: async (id: string) => api.post(`/reactions/${id}`, { kind: 'like' }),
  recommendation: async (id: string) =>
    api.post(`/reactions/${id}`, { kind: 'recommendation' }),
  removeLike: async (id: string) => api.delete(`/reactions/${id}/like`),
  removeRecommendation: async (id: string) =>
    api.delete(`/reactions/${id}/recommendation`),
};

export default comments;

// class Comment {
//   constructor() {
//     //
//   }

//   async get(
//     teacherId: number | string,
//     subjectId: number | string = '',
//     params: object,
//   ) {
//     return await api.get('/comments/' + teacherId + '/' + subjectId, {
//       params,
//     });
//   }

//   async create(body: CommentBody) {
//     return await api.post('/comments/', body);
//   }

//   async update(id: string | number, body: CommentBody) {
//     return await api.put('/comments/' + id, body);
//   }
// }

// export default new Comment();
