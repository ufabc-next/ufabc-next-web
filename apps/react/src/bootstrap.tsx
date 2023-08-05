import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HelloWorld from './components/HelloWorld';

const rootElement = document.getElementById('app');

if (!rootElement) throw new Error('Failed to find the root element.');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={window.queryClient || new QueryClient()}>
      <HelloWorld name="John" />
    </QueryClientProvider>
  </React.StrictMode>,
);
