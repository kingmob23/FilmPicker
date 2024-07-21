'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';

const UsernameForm = () => {
  const router = useRouter();
  const [usernames, setUsernames] = useState<string[]>(['']);

  const handleChange = (index: number, value: string) => {
    const newUsernames = [...usernames];
    newUsernames[index] = value;
    setUsernames(newUsernames);
  };

  const handleAdd = () => {
    setUsernames([...usernames, '']);
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    console.log('Submitting usernames:', usernames);
    try {
      const response = await fetch('http://localhost:8000/scrape/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernames })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Received result:', result);
        router.push(`/subpages/results?usernames=${encodeURIComponent(JSON.stringify(usernames))}`);
      } else {
        console.error('Failed to submit usernames');
      }
    } catch (error) {
      console.error('An error occurred while submitting usernames', error);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Container>
      <h1>Enter Usernames</h1>
      {usernames.map((username, index) => (
        <Input
          key={index}
          value={username}
          onChange={(e) => handleChange(index, e.target.value)}
        />
      ))}
      <Button onClick={handleAdd}>Add Username</Button>
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
};

export default UsernameForm;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
`;

const Input = styled.input`
  margin: 10px;
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;
