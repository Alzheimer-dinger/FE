import CalendarEmojis from '../components/CalendarEmojis';
import EmotionScoreCircle from '../components/EmotionScoreCircle';
import FooterMenu from '../components/FooterMenu';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DailyReportPage = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Title>앱 이름</Title>
      <TabMenu>
        <Tab active onClick={() => navigate('/daily')}>일간</Tab>
        <Tab onClick={() => navigate('/comprehensive')}>종합</Tab>
      </TabMenu>
      <CalendarEmojis />
      <Section>
        <EmotionScoreCircle score={90} />
        <ScoreDesc>
          오늘의 감정 평가 결과, 사용자는 전반적으로 긍정적인 기운을 유지했으며 높은 행복 지수를 보였습니다.
        </ScoreDesc>
      </Section>
      <FooterMenu />
    </Container>
  );
};

export default DailyReportPage;

const Container = styled.div`
  width: 100vw;
  max-width: 425px;
  min-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
`;

const Title = styled.h2`
  margin-top: 24px;
  font-size: 1.5rem;
  color: #6c3cff;
`;

const Section = styled.section`
  margin: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreDesc = styled.p`
  margin-top: 16px;
  font-size: 1rem;
  color: #333;
  text-align: center;
  max-width: 300px;
`;

const TabMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0 8px 0;
`;

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  outline: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ active }) => (active ? '#6c3cff' : '#bbb')};
  border-bottom: 2px solid ${({ active }) => (active ? '#6c3cff' : 'transparent')};
  padding: 8px 24px 6px 24px;
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
`; 