import styled from 'styled-components';
import { BackHeader, ContentContainer } from '@components/common/index';

const SignupTerms = () => {
  return (
    <Container>
      <BackHeader title="회원가입" />
      <ContentContainer>
        <Text>SignupTerms</Text>
      </ContentContainer>
    </Container>
  );
};

export default SignupTerms;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Text = styled.p`
  font-size: 24px;
  color: #333;
`;
