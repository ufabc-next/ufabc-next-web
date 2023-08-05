import { QueryClient } from '@tanstack/react-query';

import('./bootstrap');

export {};

declare global {
  interface Window {
    queryClient: QueryClient;
  }
}
