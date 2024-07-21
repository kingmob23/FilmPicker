'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import FilmPicker from './FilmPicker';

const ResultsList = () => {
  const searchParams = useSearchParams();
  const [intersection, setIntersection] = useState<string[]>([]);
  const [fullIntersectionLen, setfullIntersectionLen] = useState<number>(0);
  const [fetched, setFetched] = useState<boolean>(false);
  const [usernames, setUsernames] = useState<string[]>([]);

  useEffect(() => {
    const usernamesParam = searchParams.get('usernames');
    if (usernamesParam) {
      const parsedUsernames = JSON.parse(usernamesParam);
      setUsernames(parsedUsernames);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchResults = async () => {
      console.log('Starting fetchResults function.');
      try {
        const response = await fetch('http://localhost:8000/scrape/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ usernames })
        });
        const data = await response.json();
        console.log("Fetched intersection:", data.intersection);
        setIntersection(data.intersection);
        setfullIntersectionLen(data.intersection_len);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    if (usernames.length > 0 && !fetched) {
      console.log('Fetching results for the first time.');
      fetchResults();
      setFetched(true);
    }
  }, [usernames, fetched]);

  return (
    <Container>
      <Title>What to watch?</Title>
      <FilmPicker films={intersection} />
      <InfoText>btw you have {fullIntersectionLen} films in common</InfoText>
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
