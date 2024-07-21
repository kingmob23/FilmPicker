'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';

const FilmPicker = ({ films }: { films: string[] }) => {
  const [selectedFilms, setSelectedFilms] = useState<string[]>(films);

  useEffect(() => {
    setSelectedFilms(films);
  }, [films]);

  const handleToggleFilm = (film: string) => {
    if (selectedFilms.length === 1) return;

    setSelectedFilms((prev) =>
      prev.includes(film) ? prev.filter((f) => f !== film) : [...prev, film]
    );
  };

  return (
    <Container>
      <List>
        {selectedFilms.map((film, index) => (
          <ListItem
            key={index}
            onClick={() => handleToggleFilm(film)}
            $crossedOut={selectedFilms.length > 1 && !selectedFilms.includes(film)}
          >
            {film}
          </ListItem>
        ))}
      </List>
      {selectedFilms.length === 1 && <FinalChoice>{`You should watch: ${selectedFilms[0]}`}</FinalChoice>}
    </Container>
  );
};

export default FilmPicker;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListItem = styled.li<{ $crossedOut: boolean }>`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 60%;
  max-width: 400px;
  text-align: center;
  background-color: #f9f9f9;
  text-decoration: ${({ $crossedOut }) => ($crossedOut ? 'line-through' : 'none')};
  cursor: pointer;

  &:hover {
    background-color: #e9e9e9;
  }
`;

const FinalChoice = styled.p`
  margin-top: 20px;
  font-weight: bold;
`;
