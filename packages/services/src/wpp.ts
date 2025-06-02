import { SearchComponentItem } from 'types';

import { api } from './api';

export const Wpp = {
  searchComponents: async (q: string) =>
    api.get<SearchComponentItem[]>('entities/components', {
      params: { q },
    }),
};
