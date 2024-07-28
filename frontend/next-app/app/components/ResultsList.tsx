'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import FilmPicker from './FilmPicker';

const ResultsList = () => {
  const searchParams = useSearchParams();
  const [intersection, setIntersection] = useState([]);
  const [intersectionLen, setIntersectionLen] = useState(0);

  useEffect(() => {
    const intersectionParam = searchParams.get('intersection');
    const intersectionLenParam = searchParams.get('intersectionLen');

    if (intersectionParam) {
      setIntersection(JSON.parse(intersectionParam));
    }

    if (intersectionLenParam) {
      setIntersectionLen(parseInt(intersectionLenParam, 10));
    }
  }, [searchParams]);

  return (
    <Container>
      <Title>What to watch?</Title>
      <FilmPicker films={intersection} />
      <InfoText>btw you have {intersectionLen} films in common</InfoText>
    </Container>
  );
};

const ResultsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResultsList />
  </Suspense>
);

export default ResultsPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: 20px;
`;

const Title = styled.h2`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const InfoText = styled.p`
  margin-top: 20px;
  text-align: right;
  width: 60%;
  max-width: 400px;
  font-weight: bold;
`;