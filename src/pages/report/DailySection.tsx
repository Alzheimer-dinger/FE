import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CalendarEmojis, EmotionScoreCircle } from '@components/index';
import {
  getDayAnalysis,
  type DayAnalysis,
  getUserProfile,
} from '@services/api';

const formatDateYYYYMMDD = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const DailySection = () => {
  const today = useMemo(() => new Date(), []);
  const location = useLocation();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(formatDateYYYYMMDD(today));
  const [analysis, setAnalysis] = useState<DayAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const query = new URLSearchParams(location.search);
        const overrideUserId = query.get('userId');
        const me = await getUserProfile();
        const targetUserId = overrideUserId || me.patientCode || me.userId;
        const data = await getDayAnalysis(selectedDate, targetUserId);
        setAnalysis(data);
        const d = new Date(selectedDate);
        setYear(d.getFullYear());
        setMonth(d.getMonth());
      } catch {
        setError('서버 연결에 실패했습니다');
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate, location.search]);

  const monthlyData = analysis?.monthlyEmotionData ?? [];

  const dominant = useMemo(() => {
    if (!analysis) return { type: 'NONE', percent: 0 };
    const arr = [
      { type: 'HAPPY', score: analysis.happyScore, pr: 1 },
      { type: 'SAD', score: analysis.sadScore, pr: 2 },
      { type: 'ANGRY', score: analysis.angryScore, pr: 3 },
      { type: 'SURPRISED', score: analysis.surprisedScore, pr: 4 },
      { type: 'BORED', score: analysis.boredScore, pr: 5 },
    ];
    arr.sort((a, b) =>
      Math.abs(a.score - b.score) < 0.001 ? a.pr - b.pr : b.score - a.score,
    );
    return { type: arr[0].type, percent: Math.round(arr[0].score * 100) };
  }, [analysis]);

  const labelText = useMemo(() => {
    const emotionLabels: Record<string, string> = {
      HAPPY: '행복',
      SAD: '슬픔',
      ANGRY: '화남',
      SURPRISED: '놀람',
      BORED: '지루함',
      NONE: '알 수 없음',
    };
    const d = new Date(selectedDate);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const txt = `${m}월 ${day}일의 감정 평가 결과, ${emotionLabels[dominant.type] ?? '알 수 없음'}한 기운이 가장 강하게 나타났습니다. (${dominant.percent}%)`;
    return txt;
  }, [selectedDate, dominant]);

  const centerEmoji = useMemo(() => {
    switch (dominant.type) {
      case 'HAPPY':
        return '😊';
      case 'SAD':
        return '😢';
      case 'ANGRY':
        return '😠';
      case 'SURPRISED':
        return '😮';
      case 'BORED':
        return '😐';
      default:
        return '📊';
    }
  }, [dominant]);

  return (
    <DailyContent>
      <CalendarEmojis
        year={year}
        month={month}
        data={monthlyData}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <Section>
        {loading ? (
          <LoadingText>불러오는 중...</LoadingText>
        ) : error ? (
          <ErrorText>{error}</ErrorText>
        ) : analysis ? (
          <>
            <EmotionScoreCircle
              score={dominant.percent}
              centerEmoji={centerEmoji}
            />
            <ScoreDesc>{labelText}</ScoreDesc>
          </>
        ) : (
          <EmptyText>데이터가 없습니다.</EmptyText>
        )}
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
  min-height: 200px;
`;

const ScoreDesc = styled.p`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  line-height: 1.5;
  margin: 0;
`;

const LoadingText = styled.p`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
`;

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: #e74c3c;
  text-align: center;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
  color: #999;
  text-align: center;
`;
