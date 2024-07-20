import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const UsernameForm = () => {
  const [usernames, setUsernames] = useState<string[]>(['']);

  const handleChange = (index: number, value: string) => {
    const newUsernames = [...usernames];
    newUsernames[index] = value;
    setUsernames(newUsernames);
  };

  const handleAdd = () => {
    setUsernames([...usernames, '']);
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
      <Link href="/results"><Button>Submit</Button></Link>
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
