// import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from './utils/api-client';
import './App.css'
interface UserProfileData {
  name: string;
  email: string;
  secret: string;
  key: string;
}
function App() {
  const { error, isLoading } = useQuery<UserProfileData, Error>({
    queryKey: ['myself'], queryFn: () =>
      apiClient('GET', '/myself')
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <h1>Main Page</h1>
    </>
  )
}

export default App
