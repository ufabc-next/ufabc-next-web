import { rest } from 'msw';
import { user } from './users';

const baseUrl = 'https://api.ufabcnext.com/v1';

export const handlers = [
  rest.get(`${baseUrl}/users/info`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(user)),
  ),
];
