import { Button } from '@components/index';
import styled from 'styled-components';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>로그아웃 하시겠습니까?</ModalTitle>
        <LogoutButtonContainer>
          <Button buttonText="네" type="default" onClick={onConfirm} />
          <Button buttonText="아니오" type="sub" onClick={onClose} />
        </LogoutButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LogoutModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  color: #222;
  margin-bottom: 12px;
  text-align: center;
`;

const LogoutButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 20px;
`;
