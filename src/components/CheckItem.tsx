/**
 * CheckItem Component
 *
 * props:
 * - label (string): 세부 약관 이름 (예: 전체동의, 개인정보 수집 이용 동의, 이용약관 동의)
 * - checked (boolean): 체크 여부
 * - onClick (function): 클릭 시 호출되는 함수
 *
 * 사용 화면:
 * - 회원가입 약관 동의 화면 (SignupTerms.tsx)
 */

import styled from 'styled-components';
import { FaRegCircleCheck, FaCircleCheck } from 'react-icons/fa6';

interface CheckItemProps {
  label: string;
  checked: boolean;
  onClick: () => void;
}

const CheckItem = ({ label, checked, onClick }: CheckItemProps) => {
  return (
    <Item onClick={onClick}>
      {checked ? (
        <FaCircleCheck color="#BA68C8" size={26} />
      ) : (
        <FaRegCircleCheck color="#d9d9d9" size={26} />
      )}
      <span>{label}</span>
    </Item>
  );
};

export default CheckItem;

const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  cursor: pointer;
`;
