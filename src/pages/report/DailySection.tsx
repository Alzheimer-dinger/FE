import styled from 'styled-components';
import { CalendarEmojis, EmotionScoreCircle } from '@components/index';

const DailySection = () => {
  return (
    <DailyContent>
      <CalendarEmojis />
      <Section>
        <EmotionScoreCircle score={90} />
        <ScoreDesc>
          오늘의 감정 평가 결과, 사용자는 전반적으로 긍정적인 기운을 유지 했으며
          높은 행복 지수를 보였습니다.
        </ScoreDesc>
      </Section>
    </DailyContent>
  );
};

export default DailySection;

const DailyContent = styled.div`
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
