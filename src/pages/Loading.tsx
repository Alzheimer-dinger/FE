/**
 * Loading Page
 *
 */

import styled from 'styled-components';
import { HashLoader } from 'react-spinners';

const Loading = () => {
  return (
    <Container>
      <HashLoader color="#6A1B9A" size={70} speedMultiplier={0.8} />
    </Container>
  );
};

export default Loading;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;
`;
