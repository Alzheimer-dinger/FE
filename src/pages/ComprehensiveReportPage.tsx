import BudgetLine from '../components/BudgetLine';
import styled from 'styled-components';
import { BottomNav, DefaultHeader } from '../components/common';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DUMMY_REPORT = '더미 종합 보고서입니다. 서버에서 데이터를 받아오지 못했습니다.';

const ComprehensiveReportPage = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('최근 1주일');
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const periods = ['최근 1주일', '최근 1달', '사용자 설정'];

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (period === '사용자 설정') {
      setShowCalendar(true);
    } else {
      setShowCalendar(false);
    }
  };

  const handleDateSelect = (date: string, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleCalendarConfirm = () => {
    if (startDate && endDate) {
      setSelectedPeriod('사용자 설정');
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/reports/summary')
      .then((res) => {
        if (!res.ok) throw new Error('서버 오류');
        return res.json();
      })
      .then((data) => {
        // data.summary 또는 data.result 등 실제 응답 구조에 맞게 수정 필요
        setSummary(data.summary || DUMMY_REPORT);
      })
      .catch(() => {
        setSummary(DUMMY_REPORT);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <DefaultHeader showIcon={false} />
      <TabMenu>
        <Tab onClick={() => navigate('/report/daily')}>일간</Tab>
        <Tab active>종합</Tab>
      </TabMenu>
      <Section>
        <SectionTitle>OOO님의 종합 보고서</SectionTitle>
        <GraphSection>
          <GraphHeader>
            <SubTitle>감정 변화 그래프</SubTitle>
            <PeriodDropdown>
              <select 
                value={selectedPeriod} 
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </PeriodDropdown>
          </GraphHeader>
          {showCalendar && (
            <CalendarContainer>
              <CalendarTitle>기간 선택</CalendarTitle>
              <DateInputs>
                <DateInput>
                  <label>시작 날짜:</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => handleDateSelect(e.target.value, 'start')}
                  />
                </DateInput>
                <DateInput>
                  <label>끝 날짜:</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => handleDateSelect(e.target.value, 'end')}
                  />
                </DateInput>
              </DateInputs>
              <CalendarButtons>
                <button onClick={handleCalendarConfirm}>확인</button>
                <button onClick={() => setShowCalendar(false)}>취소</button>
              </CalendarButtons>
            </CalendarContainer>
          )}
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
        </GraphSection>
        <SectionTitle>종합 보고서</SectionTitle>
        <ResultBox>
          {loading ? '로딩 중...' : summary}
        </ResultBox>
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

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #222;
  font-weight: bold;
  margin-bottom: 18px;
  align-self: flex-start;
  margin-left: 5%;
`;

const GraphSection = styled.div`
  border: 1px solid #D7D7D7;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  width: 90%;
  max-width: 350px;
  overflow: hidden;
`;

const GraphHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const PeriodDropdown = styled.div`
  select {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
    font-size: 0.9rem;
    cursor: pointer;
  }
`;

const CalendarContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const CalendarTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 1rem;
  color: #333;
`;

const DateInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const DateInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  label {
    font-size: 0.9rem;
    color: #666;
    min-width: 80px;
  }
  
  input {
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
  }
`;

const CalendarButtons = styled.div`
  display: flex;
  gap: 8px;
  
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  button:first-child {
    background: #6c3cff;
    color: white;
  }
  
  button:last-child {
    background: #f0f0f0;
    color: #333;
  }
`;

const SubTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin: 24px 0 12px 0;
  justify-content: center;
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

const ResultBox = styled.div`
  width: 90%;
  max-width: 350px;
  min-height: 80px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  background: #fafafa;
  margin-top: 12px;
  white-space: pre-line;
`; 