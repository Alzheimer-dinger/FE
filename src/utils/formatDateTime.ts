/**
 * 현재 날짜와 시간을 가져오는 함수
 * - formatDate : 현재 날짜를 'YYYY.MM.DD' 형식으로 반환
 * - formatTime : 현재 시간을 'HH:MM AM/PM' 형식으로 반환
 *
 * 사용화면 - CallWaiting.tsx, CallDuration.tsx
 */

export const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

export const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const isPM = hours >= 12;
  hours = hours % 12 || 12;
  const period = isPM ? 'PM' : 'AM';
  return `${hours}:${minutes} ${period}`;
};

/**
 * 통화 시간을 나타내는 함수
 * - formatDuration : 초 단위를 'MM:SS' 형식으로 변환
 *
 * 사용화면 - CallDuration.tsx
 */

export const formatDuration = (seconds: number): string => {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
};
