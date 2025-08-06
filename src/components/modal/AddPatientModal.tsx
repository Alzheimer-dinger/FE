import styled from 'styled-components';
import { IoPersonOutline } from 'react-icons/io5';
import { Button } from '@components/index';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  error: string;
  // eslint-disable-next-line no-unused-vars
  onPatientIdChange: (id: string) => void;
  onAdd: () => void;
}

const AddPatientModal = ({
  isOpen,
  onClose,
  patientId,
  error,
  onPatientIdChange,
  onAdd,
}: AddPatientModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>환자 추가</ModalTitle>
        <InputBox $error={!!error}>
          <IoPersonOutline
            size={28}
            color={error ? '#e53935' : '#bbb'}
            style={{ marginRight: 8 }}
          />
          <AddInput
            placeholder="환자 ID를 입력하세요"
            value={patientId}
            onChange={e => onPatientIdChange(e.target.value)}
          />
        </InputBox>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Button
          type="default"
          buttonText="추가하기"
          onClick={onAdd}
          bgColor="#6c3cff"
        />
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddPatientModal;

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

const InputBox = styled.div<{ $error: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ $error }) => ($error ? '#e53935' : '#e0e0e0')};
  border-radius: 8px;
  margin-bottom: 2rem;
  background: white;
  box-sizing: border-box;
`;

const AddInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;

  &::placeholder {
    color: #bbb;
  }
`;

const ErrorMsg = styled.p`
  color: #e53935;
  font-size: 0.8rem;
  margin: 0 0 16px 0;
  align-self: flex-start;
`;
