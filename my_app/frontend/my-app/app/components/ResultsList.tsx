'use strict'
'use client'

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';

const ResultsList = () => {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<{ [key: string]: any }>({});
  const [intersection, setIntersection] = useState<any[]>([]);

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
      <h1>Results</h1>
      <h2>Common Films</h2>
      <List>
        {intersection.map((film, index) => (
          <ListItem key={index}>
            {film[0]} ({film[1]})
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ResultsList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
