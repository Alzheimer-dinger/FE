/**
 * GenderButton Component
 *
 * props:
 * - selected (boolean): 선택 여부
 * - color ('pink' | 'blue'): 성별에 따른 색상 구분
 * - label (string): 성별 라벨 텍스트
 * - emoji (string): 성별을 나타내는 이모지
 * - onClick (function): 클릭 시 호출되는 함수
 *
 * 사용 화면:
 * - 회원가입 정보 입력 화면 (Signup.tsx)
 */

import styled from 'styled-components';

interface GenderButtonProps {
  selected: boolean;
  color: 'pink' | 'blue';
  label: string;
  emoji: string;
  onClick: () => void;
}

const GenderButton = ({
  selected,
  color,
  label,
  emoji,
  onClick,
}: GenderButtonProps) => {
  return (
    <StyledButton selected={selected} color={color} onClick={onClick}>
      <span style={{ fontSize: '1.4rem' }}>{emoji}</span> {label}
    </StyledButton>
  );
};

export default GenderButton;

const StyledButton = styled.button<{
  selected: boolean;
  color: 'pink' | 'blue';
}>`
  width: 100%;
  padding: 0.5rem 0;
  border-radius: 0.5rem;
  border: 1px solid
    ${({ selected, color }) =>
      selected ? (color === 'pink' ? '#D9529C' : '#0C59F2') : '#d9d9d9'};
  background-color: ${({ selected, color }) =>
    selected ? (color === 'pink' ? '#FDD8F4' : '#DBEAFE') : '#fff'};
  color: #000;
  font-weight: 600;
  font-size: 0.9rem;
  gap: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
`;
