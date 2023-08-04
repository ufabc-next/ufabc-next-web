import React, { PropsWithChildren, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type QueryProviderProps = {
  client: QueryClient;
  slot?: ReactNode;
};

const QueryProvider = ({
  client,
  children,
  slot,
}: PropsWithChildren<QueryProviderProps>) => (
  <QueryClientProvider client={client}>{children || slot}</QueryClientProvider>
);

export default QueryProvider;
