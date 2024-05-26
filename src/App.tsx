// import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from './utils/api-client';
import './App.css'
import Books from './components/Books/books';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
interface UserProfileData {
  name: string;
  email: string;
  secret: string;
  key: string;
}
function App() {
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery<UserProfileData, Error>({
    queryKey: ['myself'], queryFn: () =>
      apiClient('GET', '/myself', {}, (path: string) => { navigate(path) })
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <h1>Main Page</h1>
      <div className='flex'>
        <h2>{'Hello ' + data?.name + '!'} </h2>
        <Button onClick={() => navigate('/books/new')} variant='contained'>Create Book</Button>
      </div>
      <Books />
    </>
  )
}

export default App
