import styled from 'styled-components';

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileImage: string;
  onImageSelect: () => void;
}

const ProfileImageModal = ({
  isOpen,
  onClose,
  profileImage,
  onImageSelect,
}: ProfileImageModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>프로필 사진 수정</ModalTitle>
        <ModalImageContainer>
          <ModalImage>
            {profileImage.startsWith('data:image') ? (
              <ProfileImgTag src={profileImage} alt="프로필" />
            ) : (
              profileImage
            )}
          </ModalImage>
        </ModalImageContainer>
        <ModalButton onClick={onImageSelect}>사진 선택하기</ModalButton>
        <ModalCancelButton onClick={onClose}>취소</ModalCancelButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProfileImageModal;

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

const ModalImageContainer = styled.div`
  margin-bottom: 20px;
`;

const ModalImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f0f8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #e3f2fd;
  font-size: 3rem;
  margin: 0 auto;
`;

const ProfileImgTag = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const ModalButton = styled.button`
  background: #6c3cff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 12px;
  width: 100%;

  &:hover {
    background: #5a2fd8;
  }
`;

const ModalCancelButton = styled.button`
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;

  &:hover {
    background: #e0e0e0;
  }
`;
