import styled from 'styled-components';

const dummyData = [60, 70, 80, 75, 65, 85, 90];

const EmotionLineChart = () => {
  // SVG width/height
  const width = 300;
  const height = 100;
  const max = 100;
  const min = 0;
  const points = dummyData
    .map((v, i) => {
      const x = (width / (dummyData.length - 1)) * i;
      const y = height - ((v - min) / (max - min)) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <ChartWrapper>
      <svg width={width} height={height}>
        <polyline
          fill="none"
          stroke="#a084fa"
          strokeWidth="3"
          points={points}
        />
        {dummyData.map((v, i) => {
          const x = (width / (dummyData.length - 1)) * i;
          const y = height - ((v - min) / (max - min)) * height;
          return <circle key={i} cx={x} cy={y} r={4} fill="#6c3cff" />;
        })}
      </svg>
    </ChartWrapper>
  );
};

export default EmotionLineChart;

const ChartWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;
