/**
 * Call - 통화 기록 화면
 *
 * 세부사항:
 * - 각 기록은 RecordCard 컴포넌트로 렌더링
 * - CallBtn 클릭 시 통화 대기 화면('/call/wating')으로 이동
 * - api 연결 전 임시데이터 callRecordData를 출력
 */

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  BottomNav,
  DefaultHeader,
  ContentContainer,
  RecordCard,
  CallBtn,
} from '@components/index';
import { groupByMonth } from '@utils/calldate';
import { callRecordData } from '@constants/dummy';

const Call = () => {
  const navigate = useNavigate();
  const grouped = groupByMonth(callRecordData);

  const handleCallClick = () => {
    navigate('/call-waiting');
  };

  return (
    <Container>
      <DefaultHeader showIcon={false} />
      <ContentContainer navMargin={true}>
        {grouped.map(([month, records]) => (
          <RecordList key={month}>
            <MonthTitle>{month}</MonthTitle>
            {records.map(record => (
              <RecordCard
                key={record.id}
                title={record.title}
                date={record.date}
                time={record.time}
              />
            ))}
          </RecordList>
        ))}
      </ContentContainer>
      <CallBtn onClick={handleCallClick} />
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

const MonthTitle = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin: 0 0 0.5rem;
`;

const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
