import styled from 'styled-components';

type MonthlyEmotionDataItem = {
  date: string; // YYYY-MM-DD
  emotionType?: string; // HAPPY | SAD | ANGRY | SURPRISED | BORED
  happyScore?: number;
  sadScore?: number;
  angryScore?: number;
  surprisedScore?: number;
  boredScore?: number;
};

type Props = {
  year: number;
  month: number; // 0-indexed (0 = Jan)
  data: MonthlyEmotionDataItem[];
  selectedDate?: string; // YYYY-MM-DD
  // eslint-disable-next-line no-unused-vars
  onSelectDate?: (date: string) => void;
};

const emotionToEmoji = (type?: string): string => {
  switch ((type || '').toUpperCase()) {
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
      return '';
  }
};

const computeDominantType = (
  item: MonthlyEmotionDataItem,
): string | undefined => {
  // 점수가 실제로 존재하는지 확인 (undefined가 아니고 null도 아닌 경우)
  const hasScores = 
    (item.happyScore !== undefined && item.happyScore !== null) ||
    (item.sadScore !== undefined && item.sadScore !== null) ||
    (item.angryScore !== undefined && item.angryScore !== null) ||
    (item.surprisedScore !== undefined && item.surprisedScore !== null) ||
    (item.boredScore !== undefined && item.boredScore !== null);
  
  if (hasScores) {
    // 점수 기반 우선순위 계산 (happy > sad > angry > surprised > bored)
    const arr = [
      { t: 'HAPPY', s: item.happyScore ?? 0, p: 1 },
      { t: 'SAD', s: item.sadScore ?? 0, p: 2 },
      { t: 'ANGRY', s: item.angryScore ?? 0, p: 3 },
      { t: 'SURPRISED', s: item.surprisedScore ?? 0, p: 4 },
      { t: 'BORED', s: item.boredScore ?? 0, p: 5 },
    ];
    arr.sort((a, b) =>
      Math.abs(a.s - b.s) < 0.000001 ? a.p - b.p : b.s - a.s,
    );
    return arr[0].s > 0 ? arr[0].t : undefined;
  }
  
  // 점수가 없다면 emotionType 사용
  return item.emotionType;
};

// Helper to get days in given month
const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const CalendarEmojis = ({
  year,
  month,
  data,
  selectedDate,
  onSelectDate,
}: Props) => {
  const daysInMonth = getDaysInMonth(year, month);

  const byDate = new Map<string, MonthlyEmotionDataItem>();
  data.forEach(d => byDate.set(d.date, d));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${year}-${mm}-${dd}`;
    const it = byDate.get(dateStr) || { date: dateStr };
    const dominantType = computeDominantType(it);
    const emoji = emotionToEmoji(dominantType);
    return { day, dateStr, emoji };
  });

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const cells: Array<{ day: number; dateStr: string; emoji: string } | null> =
    [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  cells.push(...days);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const handleClick = (
    cell: { day: number; dateStr: string; emoji: string } | null,
  ) => {
    if (cell && onSelectDate) onSelectDate(cell.dateStr);
  };

  return (
    <CalendarContainer>
      <WeekRow>
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <DayLabel key={d}>{d}</DayLabel>
        ))}
      </WeekRow>
      {weeks.map((week, wIdx) => (
        <WeekRow key={wIdx}>
          {week.map((cell, dIdx) =>
            cell ? (
              <EmojiCell
                key={dIdx}
                onClick={() => handleClick(cell)}
                $selected={selectedDate === cell.dateStr}
              >
                <DayNumber>{cell.day}</DayNumber>
                {cell.emoji && <div>{cell.emoji}</div>}
              </EmojiCell>
            ) : (
              <EmojiCell key={dIdx} />
            ),
          )}
        </WeekRow>
      ))}
    </CalendarContainer>
  );
};

export default CalendarEmojis;

const CalendarContainer = styled.div`
  margin: 24px 0 16px 0;
  padding: 16px;
  background: #f8f6ff;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
`;

const WeekRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const DayLabel = styled.div`
  font-size: 1rem;
  color: #888;
  width: 32px;
  text-align: center;
`;

const EmojiCell = styled.div<{ $selected?: boolean }>`
  font-size: 1.5rem;
  width: 36px;
  height: 52px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  border-radius: 8px;
  background: ${({ $selected }) => ($selected ? '#e0d7ff' : 'transparent')};
  box-shadow: ${({ $selected }) => ($selected ? '0 0 0 2px #6c3cff' : 'none')};
`;

const DayNumber = styled.div`
  font-size: 0.8rem;
  color: #aaa;
  margin-top: 0px;
`;
