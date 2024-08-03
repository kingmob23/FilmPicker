'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Username } from '../types';

const FilmPicker = ({ films, usernames }: { films: string[], usernames: Username[] }) => {
  const [selectedFilms, setSelectedFilms] = useState<string[]>(films);
  const [copiedFilm, setCopiedFilm] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

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

  const handleFinalDecision = async () => {
    if (selectedFilms.length !== 1) return;
    setIsRemoving(true);

    try {
      const response = await fetch('/api/watchlist/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ film: selectedFilms[0], usernames }),
      });

      if (!response.ok) {
        console.error('Failed to remove the film');
        return;
      }

      setButtonClicked(true);

    } catch (error) {
      console.error('An error occurred while removing the film', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <BigContainer>
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
      {selectedFilms.length === 1 && (
        <FinalChoice>
          {`You should watch: ${selectedFilms[0]}`}
          <ButtonContainer>
            <Button onClick={handleFinalDecision} disabled={isRemoving || buttonClicked}>
              {buttonClicked ? 'You sworn to watch it!' : 'We Will Watch It!'}
            </Button>
            {!buttonClicked && (
              <HintText>This movie will be removed from our stored copy of watchlist of every participant, so you don't need to update next time.</HintText>
            )}
          </ButtonContainer>
        </FinalChoice>
      )}
    </BigContainer>
  );
};

export default FilmPicker;

const BigContainer = styled.div`
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
  text-decoration: ${({ $crossedOut }) =>
    $crossedOut ? 'line-through' : 'none'};
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

const FinalChoice = styled.div`
  margin-top: 20px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HintText = styled.span`
  visibility: hidden;
  width: 330px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
`;

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${HintText} {
    visibility: visible;
    opacity: 1;
  }
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;
