import BudgetLine from '../components/BudgetLine';
import styled from 'styled-components';
import { BottomNav } from '../components/common';
import { useNavigate } from 'react-router-dom';

const ComprehensiveReportPage = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Title>앱 이름</Title>
      <TabMenu>
        <Tab onClick={() => navigate('/report/daily')}>일간</Tab>
        <Tab active>종합</Tab>
      </TabMenu>
      <Section>
        <SubTitle>감정 변화 그래프</SubTitle>
        <BudgetLine />
        <StatsRow>
          <StatCard>
            <StatLabel>통화 참여도</StatLabel>
            <StatValue>4/7회</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>평균 통화 시간</StatLabel>
            <StatValue>11분 20초</StatValue>
          </StatCard>
        </StatsRow>
        <WarningBox>
          <b>⚠️ 경고</b><br />
          인지 점수가 평균치보다 낮으니 가까운 병원에서 검사를 받아보시는 걸 추천해요!
        </WarningBox>
        <ReportBox placeholder="종합 보고서를 입력하세요." />
      </Section>
      <BottomNav />
    </Container>
  );
};

export default ComprehensiveReportPage;

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

const Section = styled.section`
  margin: 24px 0 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SubTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 12px;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin: 24px 0 12px 0;
`;

const StatCard = styled.div`
  background: #f8f6ff;
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatLabel = styled.div`
  font-size: 0.95rem;
  color: #888;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  color: #6c3cff;
  font-weight: bold;
  margin-top: 4px;
`;

const WarningBox = styled.div`
  background: #fff3e0;
  color: #d84315;
  border: 1px solid #ffd180;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0 12px 0;
  width: 90%;
  max-width: 350px;
  text-align: center;
  font-size: 1rem;
`;

const ReportBox = styled.textarea`
  width: 90%;
  max-width: 350px;
  min-height: 80px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  resize: none;
  margin-top: 12px;
`; 