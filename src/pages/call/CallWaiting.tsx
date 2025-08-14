/**
 * CallWaiting - 통화 대기 화면
 *
 * 세부사항:
 * - 현재 날짜(formatDate), 시간(formatTime) 표시
 * - 통화 시작 시 /call-active로 이동
 */

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, ContentContainer } from '@components/index';
import { PiPhoneCallFill } from 'react-icons/pi';
import { formatDate, formatTime } from '@utils/formatDateTime';

const CallWaiting = () => {
  const navigate = useNavigate();
  const now = new Date();

  const today = formatDate(now);
  const time = formatTime(now);

  const handleCall = () => {
    navigate('/call-active', { replace: true });
  };

  const handleBack = () => {
    navigate('/call', { replace: true });
  };

  return (
    <Container>
      <ContentContainer>
        <DateText>{today}</DateText>
        <TimeText>{time}</TimeText>
        <Message>
          안녕하세요! 오늘도 좋은하루 보내셨나요? <br />
          통화 연결하기 버튼을 눌러 <br />
          오늘의 통화를 시작해주세요!
        </Message>
        <PiPhoneCallFill size={90} color="#ba68c8" />
        <ButtonSection>
          <Button type="main" buttonText="통화 연결하기" onClick={handleCall} />
          <Button
            type="main"
            buttonText="오늘 통화 건너뛰기"
            bgColor="#d9d9d9"
            onClick={handleBack}
          />
        </ButtonSection>
      </ContentContainer>
    </Container>
  );
};

export default CallWaiting;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const DateText = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: #38006b;
  margin: 3rem 0 0 0;
`;

const TimeText = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #38006b;
  margin: 0;
`;

const Message = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: #38006b;
  line-height: 1.4;
  margin-bottom: 3rem;
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  padding-top: 10rem;
`;
