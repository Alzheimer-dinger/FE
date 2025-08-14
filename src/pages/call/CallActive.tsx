/**
 * CallActive - 실시간 통화 중 화면
 *
 * 세부사항:
 * - 현재 시간 표시 (formatTime), 통화 시간(formatDuration) 실시간 표시
 * - 사용자가 말할 때 애니메이션(VoiceWave)
 * - useAudioStream 훅으로 마이크 소리 감지
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, ContentContainer, VoiceWave } from '@components/index';
import { formatDuration, formatTime } from '@utils/formatDateTime';
import { useAudioStream } from '@hooks/useAudioStream';
import {
  GeminiAPI,
  StreamingAudioPlayer,
  Microphone,
} from '@services/gemini-client';

const WS_SCHEME = window.location.protocol === 'https:' ? 'wss' : 'ws';
const WS_HOST =
  import.meta.env.VITE_WEBSOCKET_URL?.replace(/^https?:\/\//, '') ||
  'localhost:8765';
const WS_PATH = '/ws/realtime';
const SERVER_URL = `${WS_SCHEME}://${WS_HOST}${WS_PATH}`;
const SEND_SAMPLE_RATE = 16000;
const RECEIVE_SAMPLE_RATE = 24000;

const CallActive = () => {
  const navigate = useNavigate();

  // 화면 표시용 자막 상태 (스트리밍 누적)
  const [transcripts, setTranscripts] = useState<
    { speaker: 'user' | 'ai'; text: string; final?: boolean }[]
  >([]);

  const now = new Date();
  const time = formatTime(now);
  const isAudio = useAudioStream();
  const [duration, setDuration] = useState(0);

  // 연결/오디오 객체
  const geminiRef = useRef<GeminiAPI | null>(null);
  const micRef = useRef<Microphone | null>(null);
  const playerRef = useRef<StreamingAudioPlayer | null>(null);

  const [status, setStatus] = useState('연결 준비 중...');
  const [isConnected, setIsConnected] = useState(false);

  // 통화 시간
  useEffect(() => {
    if (!isConnected) return;
    const id = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(id);
  }, [isConnected]);

  // 컴포넌트 마운트 시 자동 연결
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      setStatus('토큰 확인 중...');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setStatus('❌ accessToken이 없습니다 (localStorage)');
        return;
      }

      // 객체 생성
      playerRef.current = new StreamingAudioPlayer(RECEIVE_SAMPLE_RATE);
      geminiRef.current = new GeminiAPI(SERVER_URL, token);
      micRef.current = new Microphone(SEND_SAMPLE_RATE, (ab: ArrayBuffer) => {
        geminiRef.current?.sendAudio(ab);
      });

      // 콜백 연결
      const api = geminiRef.current;
      api.onOpen = () => {
        if (cancelled) return;
        setStatus('✅ 연결됨 및 녹음 중...');
        setIsConnected(true);
      };
      api.onClose = () => {
        if (cancelled) return;
        setStatus('🔌 연결 끊김');
        setIsConnected(false);
        stopAll();
      };
      api.onError = () => {
        if (cancelled) return;
        setStatus('❌ 웹소켓 오류');
        setIsConnected(false);
        stopAll();
      };
      api.onAudio = (b64: string) => playerRef.current?.receiveAudio(b64);
      api.onInputTranscript = (t: string) => appendTranscript(t, 'user');
      api.onOutputTranscript = (t: string) => appendTranscript(t, 'ai');
      api.onTurnComplete = () => finalizeLast();

      api.onInterrupt = () => playerRef.current?.interrupt();

      // 연결 시작
      try {
        api.connect();
        await micRef.current!.start();
      } catch (e) {
        setStatus('❌ 연결/마이크 시작 실패');
        console.error('연결 실패:', e);
        stopAll();
      }
    };

    start();

    // cleanup
    return () => {
      cancelled = true;
      stopAll();
    };
  }, []);

  const appendTranscript = (text: string, who: 'user' | 'ai') => {
    setTranscripts(prev => {
      const last = prev[prev.length - 1];
      if (last && last.speaker === who && !last.final) {
        return [...prev.slice(0, -1), { ...last, text: last.text + text }];
      }
      return [...prev, { speaker: who, text }];
    });
  };

  const finalizeLast = () => {
    setTranscripts(prev =>
      prev.length
        ? prev.map((t, i) =>
            i === prev.length - 1 ? { ...t, final: true } : t,
          )
        : prev,
    );
  };

  const stopAll = () => {
    micRef.current?.stop();
    playerRef.current?.stop();
  };

  const handleEnd = () => {
    geminiRef.current?.close();
    stopAll();
    navigate('/call', { replace: true });
  };

  return (
    <Container>
      <ContentContainer>
        <TimeMain>{time}</TimeMain>
        <StatusText>{status}</StatusText>
        <DurationText>{formatDuration(duration)}</DurationText>

        <TranscriptWrapper>
          {transcripts.map((item, idx) => (
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
  width: 100%;
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
