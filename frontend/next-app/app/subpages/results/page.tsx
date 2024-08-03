'use client';

import { Suspense } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import ResultsList from '../../components/ResultsList';

const ResultsPage = () => (
  <Container>
    <Header />
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsList />
    </Suspense>
  </Container>
);

export default ResultsPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding: 20px;
`;
