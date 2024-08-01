'use client';

import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { UsernamesContext } from '../context/UsernamesContext';
import FilmPicker from './FilmPicker';

const ResultsList = () => {
  const searchParams = useSearchParams();
  const [intersection, setIntersection] = useState([]);
  const [intersectionLen, setIntersectionLen] = useState(0);
  const { usernames } = useContext(UsernamesContext) || { setUsernames: () => {} };

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
      <FilmPicker films={intersection} usernames={usernames} />
      <InfoText>btw you have {intersectionLen} films in common</InfoText>
    </Container>
  );
};

export default ResultsList;


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
