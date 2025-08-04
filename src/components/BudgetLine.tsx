import styled from 'styled-components';
import { useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = {
  gray: '#cccccc',
  blue: '#6c3cff',
};

// Emotion data for the last 7 days
const emotionData = {
  happy: [
    { day: '월', score: 85 },
    { day: '화', score: 90 },
    { day: '수', score: 75 },
    { day: '목', score: 88 },
    { day: '금', score: 92 },
    { day: '토', score: 95 },
    { day: '일', score: 87 },
  ],
  sad: [
    { day: '월', score: 30 },
    { day: '화', score: 25 },
    { day: '수', score: 40 },
    { day: '목', score: 35 },
    { day: '금', score: 20 },
    { day: '토', score: 45 },
    { day: '일', score: 38 },
  ],
  angry: [
    { day: '월', score: 15 },
    { day: '화', score: 25 },
    { day: '수', score: 10 },
    { day: '목', score: 30 },
    { day: '금', score: 20 },
    { day: '토', score: 5 },
    { day: '일', score: 12 },
  ],
  surprised: [
    { day: '월', score: 60 },
    { day: '화', score: 45 },
    { day: '수', score: 70 },
    { day: '목', score: 55 },
    { day: '금', score: 80 },
    { day: '토', score: 65 },
    { day: '일', score: 50 },
  ],
  bored: [
    { day: '월', score: 50 },
    { day: '화', score: 45 },
    { day: '수', score: 60 },
    { day: '목', score: 40 },
    { day: '금', score: 35 },
    { day: '토', score: 70 },
    { day: '일', score: 55 },
  ],
};

const emotions = [
  { key: 'happy', emoji: '😊', label: '행복' },
  { key: 'sad', emoji: '😢', label: '슬픔' },
  { key: 'angry', emoji: '😠', label: '화남' },
  { key: 'surprised', emoji: '😲', label: '놀람' },
  { key: 'bored', emoji: '😴', label: '지루함' },
];

const CustomCursor = (props: any) => {
  const { points } = props;
  const { x } = points[0];
  return (
    <line x1={x} y1={0} x2={x} y2={120} stroke={COLORS.gray} strokeWidth={1} />
  );
};

const BudgetLine = () => {
  const [selectedEmotion, setSelectedEmotion] = useState('happy');

  const handleEmotionClick = (emotionKey: string) => {
    setSelectedEmotion(emotionKey);
  };

  return (
    <Container>
      <EmotionSelector>
        {emotions.map(emotion => (
          <EmotionButton
            key={emotion.key}
            onClick={() => handleEmotionClick(emotion.key)}
            $selected={selectedEmotion === emotion.key}
          >
            <Emoji>{emotion.emoji}</Emoji>
            <Label>{emotion.label}</Label>
          </EmotionButton>
        ))}
      </EmotionSelector>
      <GraphContainer>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart
            data={emotionData[selectedEmotion as keyof typeof emotionData]}
          >
            <XAxis dataKey="day" hide />
            <YAxis hide />
            <Tooltip cursor={<CustomCursor />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke={COLORS.blue}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </GraphContainer>
    </Container>
  );
};

export default BudgetLine;

const Container = styled.div`
  width: 100%;
  background-color: #fcfcfc;
  border-radius: 1.5rem;
  padding: 1.5rem 1rem;
  outline: none;
  overflow: hidden;
  box-sizing: border-box;
  svg {
    outline: none;
  }
`;

const EmotionSelector = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 0.2rem;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
`;

const EmotionButton = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ $selected }) => ($selected ? '#e0d7ff' : 'transparent')};
  border: 2px solid ${({ $selected }) => ($selected ? '#6c3cff' : '#eee')};
  border-radius: 8px;
  padding: 8px 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-height: 60px;
  max-width: calc(20% - 0.16rem);
  box-sizing: border-box;

  &:hover {
    background: ${({ $selected }) => ($selected ? '#e0d7ff' : '#f8f6ff')};
  }
`;

const Emoji = styled.div`
  font-size: 1.2rem;
  margin-bottom: 4px;
`;

const Label = styled.div`
  font-size: 0.5rem;
  color: #666;
  font-weight: 500;
  text-align: center;
  line-height: 1;
`;

const GraphContainer = styled.div`
  height: 120px;
`;
