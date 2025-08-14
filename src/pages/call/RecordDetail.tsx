/**
 * RecordDetail - 통화 상세보기 화면
 *
 * 세부사항:
 * - BackHeader로 상단 제목 표시
 * - 통화 정보(제목, 날짜, 시간) 요약 표시
 * - 대화 내용(transcript)을 채팅 bubble로 출력
 * - api 연동 완료
 */

import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { ContentContainer, BackHeader } from '@components/common/index';
import { formatDuration, toDotDate } from '@utils/calldate';
import Loading from '@pages/Loading';
import { requestGetFetch } from '@services/apiService';

interface DetailResponse {
  sessionId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  durationSeconds: string;
  summary: string;
  conversation: Array<{
    speaker: 'patient' | 'assistant' | string;
    content: string;
  }>;
}

const RecordDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [data, setData] = useState<DetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const formattedDate = toDotDate(data?.date || '');
  const timeRange = useMemo(() => {
    if (!data) return 'time';
    return `${data.startTime || 'start'} ~ ${data.endTime || 'end'} (${formatDuration(
      data.durationSeconds,
    )})`;
  }, [data]);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        setLoading(true);

        const json = await requestGetFetch(
          `/api/transcripts/${encodeURIComponent(sessionId ?? '')}`,
        );
        const payload: DetailResponse = (json?.result ??
          json) as DetailResponse;

        setData(payload);
        console.log('Fetched record detail (parsed):', payload);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? '상세 조회 실패');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) run();
  }, [sessionId]);

  if (loading) return <Loading />;

  return (
    <Container>
      <BackHeader title="내역 상세보기" />
      <ContentContainer>
        <Card>
          <CardTitle>통화 정보(요약본)</CardTitle>
          <CardText>
            <strong>제목: </strong> {data?.title || 'title'} <br />
            <strong>날짜: </strong> {formattedDate}
            <br />
            <strong>시간: </strong> {timeRange}
            <br />
            {data?.summary && (
              <>
                <strong>요약: </strong> {data.summary}
              </>
            )}
          </CardText>
        </Card>

        <Card>
          <CardTitle>통화 텍스트</CardTitle>
          <TranscriptWrapper>
            {data?.conversation?.length ? (
              data.conversation.map((item, idx) => (
                <Bubble
                  key={idx}
                  $isUser={String(item.speaker).toLowerCase() === 'patient'}
                >
                  {item.content || '내용 없음'}
                </Bubble>
              ))
            ) : (
              <Bubble $isUser={false}>
                {error ? '불러오기 실패' : '내용 없음'}
              </Bubble>
            )}
          </TranscriptWrapper>
        </Card>
      </ContentContainer>
    </Container>
  );
};

export default RecordDetail;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Card = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 0.8rem;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #6a1b9a;
  margin: 0 0 0.8rem;
`;

const CardText = styled.p`
  font-size: 0.9rem;
  color: #333;
  line-height: 1.6;
  margin: 0;
`;

const TranscriptWrapper = styled.div`
  background-color: #f5f5f5;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Bubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  align-self: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  background-color: ${({ $isUser }) => ($isUser ? '#F9EFFF' : '#fff')};
  color: #333;
  padding: 0.6rem 1rem;
  border-radius: 1rem;
  border-bottom-left-radius: ${({ $isUser }) => ($isUser ? '1rem' : '0.3rem')};
  border-bottom-right-radius: ${({ $isUser }) => ($isUser ? '0.3rem' : '1rem')};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  font-size: 0.8rem;
`;
