import { rest } from 'msw';
import { user } from './users';
import { enrollments } from './enrollments';

const baseUrl = 'https://api.ufabcnext.com/v1';

export const handlers = [
  rest.get(`${baseUrl}/users/info`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(user)),
  ),
  rest.get(`${baseUrl}/enrollments`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(enrollments)),
  ),
];
