/**
 * CallBtn Component
 *
 * props:
 * - onClick (function): 버튼 클릭 시 실행할 함수 (예: 통화 시작)
 *
 * 사용 화면:
 * - 통화 기록 리스트 화면 (Call.tsx) 에서 통화 시작 버튼으로 사용
 */

import styled from 'styled-components';
import { IoCall } from 'react-icons/io5';

interface CallButtonProps {
  onClick?: () => void;
}

const CallBtn = ({ onClick }: CallButtonProps) => {
  return (
    <Button onClick={onClick}>
      <IoCall size={28} color="white" />
    </Button>
  );
};

export default CallBtn;

const Button = styled.button`
  position: fixed;
  bottom: 7rem;
  right: 50%;
  transform: translateX(190px);

  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #ba68c8;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 5;

  @media (max-width: 400px) {
    transform: translateX(160px);
  }
`;
