import { http, HttpResponse } from 'msw';
import { user } from './users';
import { enrollments } from './enrollments';

const baseUrl = 'https://api.ufabcnext.com/v1';

export const handlers = [
  http.get(`${baseUrl}/users/info`, () => HttpResponse.json(user)),
  http.delete(`${baseUrl}/users/me/delete`, () => HttpResponse.json({})),
  http.get(`${baseUrl}/enrollments`, () => HttpResponse.json(enrollments)),
];
