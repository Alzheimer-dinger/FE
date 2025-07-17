import styled from 'styled-components';
import {
  BottomNav,
  DefaultHeader,
  ContentContainer,
} from '@components/common/index';

const Report = () => {
  return (
    <Container>
      <DefaultHeader showIcon={false} />
      <ContentContainer>
        <Text>Report</Text>
      </ContentContainer>
      <BottomNav />
    </Container>
  );
};

export default Report;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Text = styled.p`
  font-size: 24px;
  color: #333;
`;
