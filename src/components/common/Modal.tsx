import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Common Modal
 * @param children string (modal inner text)
 * @param  onClose () => void (onClose method)
 * @param isVisible boolean (visivle type)
 */

const Modal = ({ isVisible, onClose, children }: ModalProps) => {
  const handleBackdropClick = () => {
    onClose();
  };

  const handleContentClick = (event: React.MouseEvent) => {
    // 클릭 이벤트가 상위 요소로 전파되지 않도록 방지
    event.stopPropagation();
  };

  return (
    <ModalBackdrop isVisible={isVisible} onClick={handleBackdropClick}>
      <ModalWrapper onClick={handleContentClick}>{children}</ModalWrapper>
    </ModalBackdrop>
  );
};

export default Modal;

const ModalBackdrop = styled.div
  .withConfig({
    shouldForwardProp: prop => prop !== 'isVisible',
  })
  .attrs<{ isVisible: boolean }>(({ isVisible }) => ({
    style: {
      display: isVisible ? 'flex' : 'none',
    },
  }))`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 15;
`;

const ModalWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border: 1px solid #6a1b9a;
  max-width: 380px;
  min-height: 100px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  z-index: 15;
`;
