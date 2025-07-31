/**
 * RecordDetail - 통화 상세보기 화면
 *
 * 세부사항:
 * - BackHeader로 상단 제목 표시
 * - 통화 정보(제목, 날짜, 시간) 요약 표시
 * - 대화 내용(transcript)을 채팅 bubble로 출력
 * - api 연결 전 더미데이터 표시: recordDetailData
 */

import styled from 'styled-components';
import { ContentContainer, BackHeader } from '@components/common/index';
import { recordDetailData } from '@constants/dummy';

const RecordDetail = () => {
  const record = recordDetailData[0];
  const { title, date, time, transcript } = record;

  return (
    <Container>
      <BackHeader title="내역 상세보기" />
      <ContentContainer>
        <Card>
          <CardTitle>통화 정보(요약본)</CardTitle>
          <CardText>
            <strong>제목:</strong> {title} <br />
            <strong>날짜:</strong> {date} <br />
            <strong>시간:</strong> {time}
          </CardText>
        </Card>

        <Card>
          <CardTitle>통화 텍스트</CardTitle>
          <TranscriptWrapper>
            {transcript.map((item, idx) => (
              <Bubble key={idx} $isUser={item.speaker === 'user'}>
                {item.text}
              </Bubble>
            ))}
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
