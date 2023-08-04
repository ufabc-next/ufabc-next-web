import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';

import HelloWorld from './components/HelloWorld';
import QueryProvider from './components/QueryProvider';

const rootElement = document.getElementById('app');

if (!rootElement) throw new Error('Failed to find the root element.');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryProvider client={new QueryClient()}>
      <HelloWorld name="John" />
    </QueryProvider>
  </React.StrictMode>,
);
