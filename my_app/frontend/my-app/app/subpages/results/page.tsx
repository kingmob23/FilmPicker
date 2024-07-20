import styled from 'styled-components';
import Header from './components/Header'
import ResultsList from './components/ResultsList';

const ResultsPage = () => (
  <Container>
    <Header />
    <ResultsList />
  </Container>
);

export default ResultsPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
