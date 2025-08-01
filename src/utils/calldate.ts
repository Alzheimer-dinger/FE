/**
 * 날짜(date)를 기준으로 데이터를 '월' 단위로 그룹화하는 함수
 * - 현재 연도에 해당하는 경우: '7월'
 * - 과거 연도인 경우: '2024년 7월'
 * - 정렬은 최근 연-월 순으로 내림차순
 *
 * 사용화면 - Call.tsx
 */

export const groupByMonth = <T extends { date: string }>(records: T[]) => {
  const currentYear = new Date().getFullYear();
  const groups: Record<string, T[]> = {};

  records.forEach(record => {
    const [year, month] = record.date.split('.');
    const numericYear = Number(year);
    const monthLabel = `${month.replace(/^0/, '')}월`;
    const label =
      numericYear === currentYear ? monthLabel : `${year}년 ${monthLabel}`;

    if (!groups[label]) groups[label] = [];
    groups[label].push(record);
  });

  const parseLabel = (label: string) => {
    const match = label.match(/(\d{4})년 (\d+)월/) || [];
    if (match.length === 3) {
      return { year: Number(match[1]), month: Number(match[2]) };
    } else {
      return { year: currentYear, month: Number(label.replace('월', '')) };
    }
  };

  return Object.entries(groups).sort(([a], [b]) => {
    const aParsed = parseLabel(a);
    const bParsed = parseLabel(b);
    return bParsed.year !== aParsed.year
      ? bParsed.year - aParsed.year
      : bParsed.month - aParsed.month;
  });
};
