import styled from 'styled-components';
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

const lineData = [
  { month: '2월', amount: 400000 },
  { month: '3월', amount: 350000 },
  { month: '4월', amount: 420000 },
  { month: '5월', amount: 310000 },
  { month: '6월', amount: 480000 },
];

const CustomCursor = (props: any) => {
  const { points } = props;
  const { x } = points[0];
  return (
    <line x1={x} y1={0} x2={x} y2={120} stroke={COLORS.gray} strokeWidth={1} />
  );
};

const BudgetLine = () => {
  return (
    <Container>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={lineData}>
          <XAxis dataKey="month" hide />
          <YAxis hide />
          <Tooltip cursor={<CustomCursor />} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={COLORS.blue}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default BudgetLine;

const Container = styled.div`
  width: 100%;
  height: 120px;
  background-color: #fcfcfc;
  border-radius: 1.5rem;
  padding: 1rem;
  outline: none;
  svg {
    outline: none;
  }
`; 