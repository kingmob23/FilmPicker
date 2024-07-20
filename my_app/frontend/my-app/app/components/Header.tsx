import styled from 'styled-components';

const Header = () => (
  <Container>
    <h1>Film Picker</h1>
  </Container>
);

export default Header;

const Container = styled.header`
  padding: 20px;
  text-align: center;
  background: #282c34;
  color: white;
`;
