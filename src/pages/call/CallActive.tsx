/**
 * CallActive - 실시간 통화 중 화면
 *
 * 세부사항:
 * - 현재 시간 표시 (formatTime), 통화 시간(formatDuration) 실시간 표시
 * - 사용자가 말할 때 애니메이션(VoiceWave)
 * - useAudioStream 훅으로 마이크 소리 감지
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, ContentContainer, VoiceWave } from '@components/index';
import { formatDuration, formatTime } from '@utils/formatDateTime';
import { useAudioStream } from '@hooks/useAudioStream';

const CallActive = () => {
  const navigate = useNavigate();
  const [transcript] = useState([
    {
      speaker: 'ai',
      text: '안녕하세요. 저는 ai 000입니다. 반가워요! 오늘은 어떤 하루를 보냈나요?',
    },
  ]);
  const now = new Date();
  const time = formatTime(now);
  const isAudio = useAudioStream();
  const [duration, setDuration] = useState(0);

  // 통화 시간 측정 시작
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEnd = () => {
    navigate('/call', { replace: true });
  };

  return (
    <Container>
      <ContentContainer>
        <TimeMain>{time}</TimeMain>
        <StatusText>통화 중</StatusText>
        <DurationText>{formatDuration(duration)}</DurationText>

        <TranscriptWrapper>
          {transcript.map((item, idx) => (
            <Bubble key={idx} $isUser={item.speaker === 'user'}>
              {item.text}
            </Bubble>
          ))}

          {isAudio && (
            <RecordingBubble>
              <VoiceWave />
            </RecordingBubble>
          )}
        </TranscriptWrapper>

        <Button type="main" buttonText="통화 종료하기" onClick={handleEnd} />
      </ContentContainer>
    </Container>
  );
};

export default CallActive;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TimeMain = styled.p`
  font-size: 1.4rem;
  font-weight: 700;
  color: #38006b;
  text-align: center;
  margin: 1rem 0 0;
`;

const StatusText = styled.p`
  font-size: 0.9rem;
  color: #38006b;
  margin: 0;
`;

const DurationText = styled.p`
  font-size: 0.8rem;
  color: #38006b;
  margin: 0;
`;

const TranscriptWrapper = styled.div`
  background-color: #f5f5f5;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  height: 350px;
  margin: 1rem 0 4.5rem 0;
  overflow-y: auto;
  box-sizing: border-box;

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

const RecordingBubble = styled.div`
  align-self: flex-end;
  background-color: #f9efff;
  border-radius: 1rem;
  border-bottom-right-radius: 0.3rem;
  padding: 1rem;
  width: 40%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;
