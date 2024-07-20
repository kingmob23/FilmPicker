'use strict'
'use client'

import styled from 'styled-components';
import Header from '../../components/Header';
import UsernameForm from '../../components/UsernameForm';

const AppPage = () => (
  <Container>
    <Header />
    <UsernameForm />
  </Container>
);

export default AppPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px; /* Добавлено пространство между элементами */
`;
