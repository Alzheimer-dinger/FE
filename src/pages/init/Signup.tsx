import styled from 'styled-components';
import { BackHeader, ContentContainer } from '@components/common/index';

const Signup = () => {
  return (
    <Container>
      <BackHeader title="회원가입" />
      <ContentContainer>
        <Text>Signup</Text>
      </ContentContainer>
    </Container>
  );
};

export default Signup;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Text = styled.p`
  font-size: 24px;
  color: #333;
`;
