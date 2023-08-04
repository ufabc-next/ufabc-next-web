import React from 'react';
import { auth } from 'stores';
import { useStore } from 'zustand';

type HelloWorldProps = {
  name: string;
};

export default function HelloWorld({ name }: HelloWorldProps) {
  const { user } = useStore(auth);

  return (
    <>
      <h1>Hello, {name}!!!</h1>
      <h2>Your info in React: {user?.email}</h2>
    </>
  );
}
