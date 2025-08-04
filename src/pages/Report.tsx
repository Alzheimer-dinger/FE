import styled from 'styled-components';
import { useState } from 'react';
import {
  DefaultHeader,
  BottomNav,
  ContentContainer,
  TabMenu,
  CalendarEmojis,
  EmotionScoreCircle,
  BudgetLine,
} from '@components/index';

const Report = () => {
  const [activeTab, setActiveTab] = useState('일간');

  const tabs = ['일간', '종합'];

  return (
    <Container>
      <DefaultHeader showIcon={false} />
      <ContentContainer>
        {/* Tab Menu */}
        <TabMenu tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Daily Report Content */}
        {activeTab === '일간' && (
          <DailyContent>
            <CalendarEmojis />
            <Section>
              <EmotionScoreCircle score={90} />
              <ScoreDesc>
                오늘의 감정 평가 결과, 사용자는 전반적으로 긍정적인 기운을
                유지했으며 높은 행복 지수를 보였습니다.
              </ScoreDesc>
            </Section>
          </DailyContent>
        )}

        {/* Total Report Content */}
        {activeTab === '종합' && (
          <TotalContent>
            <SectionTitle>OOO님의 종합 보고서</SectionTitle>
            <GraphSection>
              <GraphHeader>
                <SubTitle>감정 변화 그래프</SubTitle>
                <PeriodDropdown>
                  <select defaultValue="최근 1주일">
                    <option value="최근 1주일">최근 1주일</option>
                    <option value="최근 1달">최근 1달</option>
                    <option value="사용자 설정">사용자 설정</option>
                  </select>
                </PeriodDropdown>
              </GraphHeader>
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
                <b>⚠️ 경고</b>
                <br />
                인지 점수가 평균치보다 낮으니 가까운 병원에서 검사를 받아보시는
                걸 추천해요!
              </WarningBox>
            </GraphSection>
            <SectionTitle>종합 보고서</SectionTitle>
            <ResultBox>
              더미 종합 보고서입니다. 서버에서 데이터를 받아오지 못했습니다.
            </ResultBox>
          </TotalContent>
        )}
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

const DailyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TotalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ScoreDesc = styled.p`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  line-height: 1.5;
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin: 1rem 0 0.5rem 0;
`;

const GraphSection = styled.div`
  border: 1px solid #d7d7d7;
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
`;

const GraphHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SubTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const PeriodDropdown = styled.div`
  select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    background: white;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const StatCard = styled.div`
  flex: 1;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const WarningBox = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #856404;
`;

const ResultBox = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
`;
