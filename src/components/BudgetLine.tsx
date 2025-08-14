import styled from 'styled-components';
import { useMemo, useState } from 'react';
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

type PeriodPoint = {
  date: string;
  happyScore: number;
  sadScore: number;
  angryScore: number;
  surprisedScore: number;
  boredScore: number;
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

interface Props {
  data?: PeriodPoint[] | null;
}

const BudgetLine = ({ data }: Props) => {
  const [selectedEmotion, setSelectedEmotion] = useState('happy');

  const handleEmotionClick = (emotionKey: string) => {
    setSelectedEmotion(emotionKey);
  };

  const chartData = useMemo(() => {
    if (!data || data.length === 0)
      return [] as { label: string; score: number }[];
    const keyMap: Record<string, keyof PeriodPoint> = {
      happy: 'happyScore',
      sad: 'sadScore',
      angry: 'angryScore',
      surprised: 'surprisedScore',
      bored: 'boredScore',
    };
    const scoreKey = keyMap[selectedEmotion];
    return data.map(p => {
      const [, m, d] = p.date.split('-');
      const label = `${m}-${d}`;
      const raw = (p[scoreKey] as unknown as number) ?? 0;
      const score = Math.round(raw * 100);
      return { label, score };
    });
  }, [data, selectedEmotion]);

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
        {!data || data.length === 0 ? (
          <EmptyText>정보가 없습니다</EmptyText>
        ) : (
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
              <XAxis dataKey="label" />
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
        )}
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

const EmptyText = styled.div`
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 0.9rem;
`;
