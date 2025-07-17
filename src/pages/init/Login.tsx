import styled from 'styled-components';
import { ContentContainer } from '@components/common/index';

const Login = () => {
  return (
    <Container>
      <ContentContainer>
        <Text>Login</Text>
      </ContentContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Text = styled.p`
  font-size: 24px;
  color: #333;
`;
