import React from 'react';

type HelloWorldProps = {
  name: string;
};

export default function HelloWorld({ name }: HelloWorldProps) {
  return <h1>Hello, {name}!!!</h1>;
}
