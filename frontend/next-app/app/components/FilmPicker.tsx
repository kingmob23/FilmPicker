'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

const FilmPicker = ({ films }: { films: string[] }) => {
  const [selectedFilms, setSelectedFilms] = useState<string[]>(films);
  const [copiedFilm, setCopiedFilm] = useState<string | null>(null);

  useEffect(() => {
    setSelectedFilms(films);
  }, [films]);

  const handleToggleFilm = (film: string) => {
    if (selectedFilms.length === 1) return;

    setSelectedFilms((prev) =>
      prev.includes(film) ? prev.filter((f) => f !== film) : [...prev, film]
    );
  };

  const handleCopyFilm = (film: string) => {
    navigator.clipboard.writeText(film);
    setCopiedFilm(film);
    setTimeout(() => setCopiedFilm(null), 1000);
  };

  return (
    <Container>
      <List>
        {selectedFilms.map((film, index) => (
          <ListItem key={index}>
            <FilmText
              onClick={() => handleToggleFilm(film)}
              $crossedOut={selectedFilms.length > 1 && !selectedFilms.includes(film)}
            >
              {film}
            </FilmText>
            <CopyButton
              onClick={() => handleCopyFilm(film)}
              $isCopied={copiedFilm === film}
            >
              {copiedFilm === film ? 'Copied' : 'Copy'}
            </CopyButton>
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

const ListItem = styled.li`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 60%;
  max-width: 400px;
  text-align: center;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #e9e9e9;
  }
`;

const FilmText = styled.span<{ $crossedOut: boolean }>`
  text-decoration: ${({ $crossedOut }) => ($crossedOut ? 'line-through' : 'none')};
  cursor: pointer;
  flex-grow: 1;
`;

const CopyButton = styled.button<{ $isCopied: boolean }>`
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  background-color: ${({ $isCopied }) => ($isCopied ? '#a0a0a0' : '#dcdcdc')};
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0c0c0;
  }
`;

const FinalChoice = styled.p`
  margin-top: 20px;
  font-weight: bold;
`;
