/**
 * 날짜(date)를 기준으로 데이터를 '월' 단위로 그룹화하는 함수
 * - 현재 연도에 해당하는 경우: '7월'
 * - 과거 연도인 경우: '2024년 7월'
 * - 정렬은 최근 연-월 순으로 내림차순
 *
 * 사용화면 - Call.tsx
 */

type WithDate = { date?: string };

export const groupByMonth = <T extends WithDate>(records: T[]) => {
  const currentYear = new Date().getFullYear();
  const groups = new Map<string, T[]>();

  const isoRe = /^(\d{4})-(\d{2})-(\d{2})$/;

  for (const r of records) {
    let label = '날짜 미상';

    if (r?.date && isoRe.test(r.date)) {
      const [, y, m] = r.date.match(isoRe)!;
      const year = Number(y);
      const month = Number(m);
      label = year === currentYear ? `${month}월` : `${year}년 ${month}월`;
    }

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(r);
  }

  const sortKey = (label: string) => {
    if (label === '날짜 미상') return { y: -Infinity, m: -Infinity };
    const full = label.match(/^(\d{4})년\s+(\d{1,2})월$/);
    if (full) return { y: Number(full[1]), m: Number(full[2]) };
    const cur = label.match(/^(\d{1,2})월$/);
    if (cur) return { y: currentYear, m: Number(cur[1]) };
    return { y: -Infinity, m: -Infinity };
  };

  return [...groups.entries()].sort(([a], [b]) => {
    const A = sortKey(a);
    const B = sortKey(b);
    return B.y !== A.y ? B.y - A.y : B.m - A.m;
  });
};

/**
 * ISO 날짜 문자열(YYYY-MM-DD)을 점 표기(YYYY.MM.DD)로 변환
 *
 * 사용화면 - RecordCard.tsx, RecordDetail.tsx
 */

export const toDotDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const m = isoDate.split('T')[0].match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return isoDate;
  return `${m[1]}.${m[2]}.${m[3]}`;
};

/**
 * 초 단위를 "00분 00초" 형식으로 변환
 *
 * 사용화면 - RecordCard.tsx, RecordDetail.tsx
 */
export const formatDuration = (secLike?: string) => {
  const totalSec = Number(secLike ?? 0);
  if (!Number.isFinite(totalSec) || totalSec <= 0) return '00분 00초';
  const minutes = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const seconds = String(totalSec % 60).padStart(2, '0');
  return `${minutes}분 ${seconds}초`;
};
