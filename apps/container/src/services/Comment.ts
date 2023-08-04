import api from '@/utils/api';

type CommentBody = object;

class Comment {
  constructor() {
    //
  }

  async get(
    teacherId: number | string,
    subjectId: number | string = '',
    params: object,
  ) {
    return await api.get('/comments/' + teacherId + '/' + subjectId, {
      params,
    });
  }

  async create(body: CommentBody) {
    return await api.post('/comments/', body);
  }

  async update(id: string | number, body: CommentBody) {
    return await api.put('/comments/' + id, body);
  }
}

export default new Comment();
