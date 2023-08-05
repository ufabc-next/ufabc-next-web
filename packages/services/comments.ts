import api from './api';

type CommentBody = object;

const comment = {
  get: (
    teacherId: number | string,
    subjectId: number | string = '',
    params: object,
  ) =>
    api.get('/comments/' + teacherId + '/' + subjectId, {
      params,
    }),
  create: (body: CommentBody) => api.post('/comments/', body),
  update: (id: string | number, body: CommentBody) =>
    api.put('/comments/' + id, body),
};

export default comment;
