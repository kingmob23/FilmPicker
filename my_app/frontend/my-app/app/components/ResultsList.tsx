import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ResultsList = () => {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    // Fetch results from backend
    fetch('/api/results')
      .then(response => response.json())
      .then(data => setResults(data));
  }, []);

  return (
    <Container>
      <h1>Results</h1>
      <List>
        {results.map((result, index) => (
          <ListItem key={index}>{result}</ListItem>
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
