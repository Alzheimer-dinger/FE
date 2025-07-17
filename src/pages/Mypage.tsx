import styled from 'styled-components';
import {
  BottomNav,
  DefaultHeader,
  ContentContainer,
} from '@components/common/index';

const Mypage = () => {
  return (
    <Container>
      <DefaultHeader showIcon={false} />
      <ContentContainer>
        <Text>Mypage</Text>
      </ContentContainer>
      <BottomNav />
    </Container>
  );
};

export default Mypage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Text = styled.p`
  font-size: 24px;
  color: #333;
`;
