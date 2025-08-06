/**
 * RoleSelector Component
 *
 * props:
 * - role ('patient' | 'guardian'): 현재 선택된 역할
 * - onChange (function): 역할 변경 시 호출되는 콜백 함수
 *
 * 사용 화면:
 * - 로그인 화면 (Login.tsx)
 */

import styled from 'styled-components';

interface RoleSelectorProps {
  role: 'patient' | 'guardian';
  // eslint-disable-next-line no-unused-vars
  onChange: (role: 'patient' | 'guardian') => void;
}

const RoleSelector = ({ role, onChange }: RoleSelectorProps) => {
  return (
    <Wrapper>
      <Highlight position={role === 'patient' ? 'left' : 'right'} />
      <RoleButton
        selected={role === 'patient'}
        onClick={() => onChange('patient')}
      >
        환자
      </RoleButton>
      <RoleButton
        selected={role === 'guardian'}
        onClick={() => onChange('guardian')}
      >
        보호자
      </RoleButton>
    </Wrapper>
  );
};

export default RoleSelector;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: 200px;
  background-color: #f3f4f6;
  border-radius: 3rem;
  padding: 0.4rem;
  margin-bottom: 0.8rem;
  overflow: hidden;
`;

const Highlight = ({ position }: { position: 'left' | 'right' }) => {
  const left = position === 'left' ? '4px' : 'calc(50% + 4px)';
  return <HighlightWrapper style={{ left }} />;
};

const HighlightWrapper = styled.div`
  position: absolute;
  top: 4px;
  width: calc(50% - 8px);
  height: calc(100% - 8px);
  background-color: #ffffff;
  border-radius: 3rem;
  transition: all 0.3s ease;
  z-index: 1;
`;

const RoleButton = styled.button<{ selected: boolean }>`
  flex: 1;
  z-index: 2;
  background: none;
  border: none;
  padding: 0.5rem 0;
  border-radius: 3rem;
  color: ${({ selected }) => (selected ? '#000' : '#767676')};
  font-weight: 500;
  transition: color 0.2s ease;
  cursor: pointer;
`;
