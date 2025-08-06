import styled from 'styled-components';
import { Button } from '@components/index';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'disconnect' | 'reconnect';
  onConfirm: () => void;
}

const ConfirmActionModal = ({
  isOpen,
  onClose,
  actionType,
  onConfirm,
}: ConfirmActionModalProps) => {
  if (!isOpen) return null;

  const title =
    actionType === 'disconnect'
      ? '연결을 해제하시겠습니까?'
      : '재연결 하시겠습니까?';

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle style={{ marginBottom: 32 }}>{title}</ModalTitle>
        <ConfirmBtnRow>
          <Button
            type="default"
            buttonText="네"
            onClick={onConfirm}
            bgColor="#6c3cff"
          />
          <Button
            type="sub"
            buttonText="아니요"
            onClick={onClose}
            bgColor="#f5f5f5"
            txtColor="#666"
          />
        </ConfirmBtnRow>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmActionModal;

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
  padding: 24px 20px 20px 20px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  color: #222;
  margin-bottom: 12px;
  text-align: center;
`;

const ConfirmBtnRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;
