import React from 'react';
import styled from 'styled-components';

const Header = React.memo(() => (
  <Container>
    <h1>Film Picker</h1>
  </Container>
));

Header.displayName = 'Header';

export default Header;

const Container = styled.header`
  padding: 20px;
  text-align: center;
  background: #282c34;
  color: white;
  margin-bottom: 20px;
`;
