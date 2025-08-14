import styled from 'styled-components';

type Props = {
  score: number;
  centerEmoji?: string;
};

const EmotionScoreCircle = ({ score, centerEmoji = '😊' }: Props) => {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = score / 100;
  const strokeDashoffset = circumference * (1 - percent);

  return (
    <CircleWrapper>
      <svg
        height={radius * 2}
        width={radius * 2}
        role="img"
        aria-label={`감정 점수 ${score}%`}
      >
        <circle
          stroke="#e0d7ff"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#a084fa"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="1.5rem"
          fill="#6c3cff"
        >
          {centerEmoji}
        </text>
      </svg>
      <ScoreText>{score}%</ScoreText>
    </CircleWrapper>
  );
};

export default EmotionScoreCircle;

const CircleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreText = styled.div`
  margin-top: 8px;
  font-size: 1.2rem;
  color: #6c3cff;
  font-weight: bold;
`;
