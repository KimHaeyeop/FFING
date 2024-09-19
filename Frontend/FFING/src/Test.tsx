// src/Test.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useBearStore from './store';

const fetchBears = async (): Promise<any> => {
  const response = await fetch('https://dog.ceo/api/breeds/image/random');
  return response.json();
};

const Test: React.FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['bears'],
    queryFn: fetchBears,
  });
  const bears = useBearStore((state) => state.bears);
  const increase = useBearStore((state) => state.increase);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Bears: {bears}</h1>
      <button onClick={increase}>Increase</button>
      <div>
        <h2>Fetched Bears:</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Test;
