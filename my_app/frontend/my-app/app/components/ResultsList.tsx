import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';

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
      <List>
        {intersection.map((film, index) => (
          <ListItem key={index}>
            {film}
          </ListItem>
        ))}
      </List>
      <InfoText>*btw you have {intersectionLen} films in common</InfoText>
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

const List = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-height: 60vh; /* Ограничение высоты списка с прокруткой */
  overflow-y: auto; /* Добавлено для прокрутки */
  display: flex;
  flex-direction: column;
  align-items: center; /* Центрирование элементов списка */
`;

const ListItem = styled.li`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 60%;
  max-width: 400px;
  text-align: center;
  background-color: #f9f9f9;
`;

const InfoText = styled.p`
  margin-top: 20px;
  text-align: right;
  width: 60%;
  max-width: 400px;
  font-weight: bold;
`;
