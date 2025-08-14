/**
 * Call - 통화 기록 화면
 *
 * 세부사항:
 * - 각 기록은 RecordCard 컴포넌트로 렌더링
 * - CallBtn 클릭 시 통화 대기 화면('/call/wating')으로 이동
 * - api 연동 완료
 */

import { useEffect, useMemo, useState } from 'react';
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

interface TranscriptResponse {
  sessionId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  durationSeconds: string;
}

const Call = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<TranscriptResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const grouped = useMemo(() => groupByMonth(items), [items]);

  const handleCallClick = () => {
    navigate('/call-waiting');
  };

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('accessToken') ?? '';

        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/transcripts`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: token ? `Bearer ${token}` : '',
            },
          },
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        const list: TranscriptResponse[] = Array.isArray(json?.result)
          ? json.result
          : [];

        setItems(list);
      } catch (e: any) {
        setError(e?.message ?? '불명확한 오류');
      } finally {
        setLoading(false);
      }
    };

    fetchTranscripts();
  }, []);

  return (
    <Container>
      <DefaultHeader showIcon={false} />
      <ContentContainer navMargin={true}>
        {loading && <StatusText>불러오는 중...</StatusText>}
        {error && !loading && <StatusText>오류: {error}</StatusText>}

        {!loading && !error && items.length === 0 && (
          <StatusText>통화 기록이 없습니다</StatusText>
        )}

        {!loading &&
          !error &&
          grouped.map(([month, records]) => (
            <RecordList key={month}>
              <MonthTitle>{month}</MonthTitle>
              {records.map(record => (
                <RecordCard
                  key={record.sessionId}
                  sessionId={record.sessionId}
                  title={record.title}
                  date={record.date}
                  startTime={record.startTime}
                  endTime={record.endTime}
                  durationSeconds={record.durationSeconds}
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

const StatusText = styled.p`
  font-size: 0.9rem;
  color: #666;
`;
