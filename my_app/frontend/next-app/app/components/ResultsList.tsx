'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import FilmPicker from './FilmPicker';

const ResultsList = () => {
  const searchParams = useSearchParams();
  const [intersection, setIntersection] = useState<string[]>([]);
  const [intersectionLen, setIntersectionLen] = useState<number>(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const usernames = JSON.parse(searchParams.get('usernames') || '[]');
        const response = await fetch('http://localhost:8000/scrape/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ usernames })
        });
        const data = await response.json();
        console.log("Fetched intersection:", data.intersection); // Отладочная информация
        setIntersection(data.intersection);
        setIntersectionLen(data.intersection_len);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    if (searchParams.get('usernames')) {
      fetchResults();
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

export default ResultsList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Центрирование по вертикали */
  width: 100%;
  height: 100vh; /* Центрирование контейнера по высоте окна */
  padding: 20px;
`;

const Title = styled.h2`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const InfoText = styled.p`
  margin-top: 20px; /* Увеличенный отступ от списка фильмов */
  text-align: right; /* Выравнивание текста по правому краю */
  width: 60%; /* Ширина соответствует ширине плашек фильмов */
  max-width: 400px; /* Максимальная ширина текста */
  font-weight: bold; /* Толстый текст */
`;
