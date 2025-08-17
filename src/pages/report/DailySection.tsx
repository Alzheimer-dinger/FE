import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CalendarEmojis, EmotionScoreCircle } from '@components/index';
import {
  getDayAnalysis,
  getMonthlyEmotionData,
  type DayAnalysis,
  type MonthlyEmotionDataItem,
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
  const [monthlyData, setMonthlyData] = useState<MonthlyEmotionDataItem[]>([]);
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
        const targetUserId = overrideUserId || me.userId;
        
        // 일간 분석 데이터 가져오기
        const dayData = await getDayAnalysis(selectedDate, targetUserId);
        if (!dayData || !dayData.hasData) {
          console.log('📅 [일간 분석] 데이터 없음 - 빈 상태로 설정');
          setAnalysis({
            userId: targetUserId,
            analysisDate: selectedDate,
            hasData: false,
            happyScore: 0,
            sadScore: 0,
            angryScore: 0,
            surprisedScore: 0,
            boredScore: 0
          });
        } else {
          setAnalysis(dayData);
        }
        
        // 월간 감정 데이터 가져오기 (캘린더용)
        const monthData = await getMonthlyEmotionData(selectedDate, targetUserId);
        setMonthlyData(monthData?.monthlyEmotionData || []);
        
        const d = new Date(selectedDate);
        setYear(d.getFullYear());
        setMonth(d.getMonth());
      } catch {
        setError('서버 연결에 실패했습니다');
        setAnalysis(null);
        setMonthlyData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate, location.search]);

  const dominant = useMemo(() => {
    if (!analysis || !analysis.hasData) return { type: 'none', percent: 0 };
    const arr = [
      { type: 'happy', score: analysis.happyScore, pr: 1 },
      { type: 'sad', score: analysis.sadScore, pr: 2 },
      { type: 'angry', score: analysis.angryScore, pr: 3 },
      { type: 'surprised', score: analysis.surprisedScore, pr: 4 },
      { type: 'bored', score: analysis.boredScore, pr: 5 },
    ];
    arr.sort((a, b) =>
      Math.abs(a.score - b.score) < 0.001 ? a.pr - b.pr : b.score - a.score,
    );
    return { type: arr[0].type, percent: Math.round(arr[0].score * 100) };
  }, [analysis]);

  const labelText = useMemo(() => {
    const emotionLabels: Record<string, string> = {
      happy: '행복',
      sad: '슬픔',
      angry: '화남',
      surprised: '놀람',
      bored: '지루함',
      none: '알 수 없음',
    };
    const d = new Date(selectedDate);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const txt = `${m}월 ${day}일의 감정 평가 결과, ${emotionLabels[dominant.type] ?? '알 수 없음'}한 기운이 가장 강하게 나타났습니다. (${dominant.percent}%)`;
    return txt;
  }, [selectedDate, dominant]);

  const centerEmoji = useMemo(() => {
    switch (dominant.type) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      case 'angry':
        return '😠';
      case 'surprised':
        return '😮';
      case 'bored':
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
        ) : analysis && analysis.hasData ? (
          <>
            <EmotionScoreCircle
              score={dominant.percent}
              centerEmoji={centerEmoji}
            />
            <ScoreDesc>{labelText}</ScoreDesc>
          </>
        ) : (
          <EmptyText>해당 날짜의 감정 분석 데이터가 없습니다.</EmptyText>
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
  width: 95%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 0.5rem;
  box-sizing: border-box;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-height: 200px;
  width: 100%;
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
