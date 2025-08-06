/**
 * VoiceWave 컴포넌트
 *
 * 상세설명:
 * - 통화 중 사용자의 발화 상태를 시각적으로 나타내는 애니메이션
 *
 * 사용 화면:
 * 통화 중 화면 (CallActive.tsx)
 */

import styled, { keyframes } from 'styled-components';

const VoiceWave = () => {
  return (
    <WaveContainer>
      {[...Array(7)].map((_, i) => (
        <Bar key={i} $index={i} />
      ))}
    </WaveContainer>
  );
};

export default VoiceWave;

const bounce = keyframes`
  0%, 100% {
    transform: scaleY(0.4);
  }
  50% {
    transform: scaleY(1);
  }
`;

const WaveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: 0.8rem;
`;

const Bar = styled.div<{ $index: number }>`
  width: 0.2rem;
  height: 0.8rem;
  margin: 0 3px;
  background-color: #38006b;
  animation: ${bounce} 1s infinite;
  animation-delay: ${({ $index }) => $index * 0.1}s;
  transform-origin: bottom;
  border-radius: 2px;
`;
