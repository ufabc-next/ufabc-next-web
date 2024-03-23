// import { Enrollment } from 'types';

// import { api } from './api';

// export const Graduations = {
//   list: () => api.get('/graduation', { params: { limit: 100 } }),
//   get: (id: string) => api.get<Enrollment>('/graduation/' + id),
// };

import { Enrollment } from 'types';

import { api } from './api';

export const Graduations = {
  // list: () =>
  //   api.get('/subjectGraduations', {
  //     params: {
  //       populate: 'subject',
  //       limit: 100,
  //       graduation: '5f246b4755e97a731eece9ba',
  //     },
  //   }),
  list1: () => api.get('/graduation', { params: { limit: 100 } }),
  get: (id: string) => api.get<Enrollment>('/graduation/' + id),
  list: () =>
    api.get('/subjectGraduations', {
      params: {
        populate: 'subject',
        limit: 100,
        graduation: '5f246e7e55e97a731eed450e'
      }
    })
};
