'use client';

import Link from 'next/link';
import styled from 'styled-components';
import Header from './components/Header';

const HomePage = () => (
  <Container>
    <Header />
    <h1>Welcome to Film Picker</h1>
    <Link href="/subpages/app"><Button>Go to App</Button></Link>
    <Link href="/help"><Button>Help</Button></Link>
  </Container>
);

export default HomePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  gap: 20px; /* Добавлено пространство между элементами */
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;
