/**
 * RecordCard Component
 *
 * props:
 * - title (string): 통화 제목
 * - date (string): 통화 일자 (예: 2025.07.08)
 * - time (string): 통화 시간 범위 및 통화 시간
 *
 * 사용 화면:
 * - 통화 기록 리스트 화면 (Call.tsx)
 */

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiChevronRight } from 'react-icons/fi';

interface RecordCardProps {
  title: string;
  date: string;
  time: string;
}

const RecordCard = ({ title, date, time }: RecordCardProps) => {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate(`/call-detail/${date}`);
  };

  return (
    <Card>
      <CardInfo>
        <Title>{title}</Title>
        <DateTime>{date}</DateTime>
        <DateTime>{time}</DateTime>
      </CardInfo>
      <FiChevronRight
        size={24}
        color="#6A1B9A"
        style={{ cursor: 'pointer' }}
        onClick={handleNextClick}
      />
    </Card>
  );
};

export default RecordCard;

const Card = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 0.8rem;
  padding: 1rem;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  margin-bottom: 0.5rem;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #000;
  margin-bottom: 0.2rem;
`;

const DateTime = styled.div`
  font-size: 0.8rem;
  color: #555;
`;
