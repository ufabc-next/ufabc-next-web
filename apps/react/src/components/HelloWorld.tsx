import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Enrollments } from 'services';
import { authStore } from 'stores';
import { useStore } from 'zustand';

type HelloWorldProps = {
  name: string;
};

export default function HelloWorld({ name }: HelloWorldProps) {
  const { user } = useStore(authStore);

  const { data } = useQuery(
    {
      queryKey: ['enrollments'],
      queryFn: Enrollments.list,
      placeholderData: (prev) => prev,
    },
    window.queryClient,
  );

  return (
    <>
      <h1>Hello, {name}!!!</h1>
      <h2>Your info in React: {user?.email}</h2>
      <pre>{!!data && JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
