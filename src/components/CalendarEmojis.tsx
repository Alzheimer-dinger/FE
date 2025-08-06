import styled from 'styled-components';
import { useState } from 'react';

const emojis = ['😊', '😐', '😢'];

// Helper to get days in current month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const CalendarEmojis = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const daysInMonth = getDaysInMonth(year, month);

  // Dummy data: rotate through emojis for each day
  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    emoji: emojis[i % emojis.length],
  }));

  // Get the weekday of the 1st day of the month (0: Sunday, 6: Saturday)
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Fill calendar grid (start from firstDayOfWeek)
  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null); // empty cell
  }
  for (let i = 0; i < days.length; i++) {
    calendarCells.push(days[i]);
  }
  // Fill the rest of the last week with nulls
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  // Split into weeks
  const weeks = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    weeks.push(calendarCells.slice(i, i + 7));
  }

  // State for selected day
  const [selectedDay, setSelectedDay] = useState<number | null>(
    today.getDate(),
  );

  const handleClick = (cell: any) => {
    if (cell) {
      setSelectedDay(cell.day);
    }
  };

  return (
    <CalendarContainer>
      <WeekRow>
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <DayLabel key={day}>{day}</DayLabel>
        ))}
      </WeekRow>
      {weeks.map((week, wIdx) => (
        <WeekRow key={wIdx}>
          {week.map((cell, dIdx) =>
            cell ? (
              <EmojiCell
                key={dIdx}
                onClick={() => handleClick(cell)}
                $selected={selectedDay === cell.day}
              >
                <DayNumber>{cell.day}</DayNumber>
                <div>{cell.emoji}</div>
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
  width: 90%;
  max-width: 350px;
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
