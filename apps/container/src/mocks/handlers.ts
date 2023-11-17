import { http, HttpResponse } from 'msw';
import { user, userGrades } from './users';
import { enrollments } from './enrollments';
import {
  usage,
  courses,
  classes,
  overview,
  courseNames,
  classesPage1,
  subjects,
  grades,
} from './stats';
import { historiesGraduations } from './performance';

const baseUrl = 'https://api.ufabcnext.com/v1';

export const handlers = [
  http.get(`${baseUrl}/users/info`, () => HttpResponse.json(user)),
  http.delete(`${baseUrl}/users/me/delete`, () => HttpResponse.json({})),
  http.get(`${baseUrl}/enrollments`, () => HttpResponse.json(enrollments)),
  http.get(`${baseUrl}/stats/usage`, () => HttpResponse.json(usage)),
  http.get(`${baseUrl}/stats/disciplinas/courses`, () =>
    HttpResponse.json(courses),
  ),
  http.get(`${baseUrl}/stats/disciplinas`, ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get('page') === '1') {
      return HttpResponse.json(classesPage1);
    }
    return HttpResponse.json(classes);
  }),
  http.get(`${baseUrl}/stats/disciplinas/overview`, () =>
    HttpResponse.json(overview),
  ),
  http.get(`${baseUrl}/stats/disciplinas/disciplines`, () =>
    HttpResponse.json(subjects),
  ),
  http.get(`${baseUrl}/histories/courses`, () =>
    HttpResponse.json(courseNames),
  ),
  http.get(`${baseUrl}/users/me/grades`, () => HttpResponse.json(userGrades)),
  http.get(`${baseUrl}/stats/grades`, () => HttpResponse.json(grades)),
  http.get(`${baseUrl}/historiesGraduations`, () =>
    HttpResponse.json(historiesGraduations),
  ),
  http.post(`${baseUrl}/account/confirm`, () => HttpResponse.json({})),
  http.post(`${baseUrl}/users/me/recover`, () => HttpResponse.json({})),
];
