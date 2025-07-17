import styled from 'styled-components';
import {
  BottomNav,
  DefaultHeader,
  ContentContainer,
} from '@components/common/index';

const Call = () => {
  return (
    <Container>
      <DefaultHeader />
      <ContentContainer>
        <Text>Call</Text>
      </ContentContainer>
      <BottomNav />
    </Container>
  );
};

export default Call;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Text = styled.p`
  font-size: 24px;
  color: #333;
`;
