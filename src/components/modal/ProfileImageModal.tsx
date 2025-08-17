import { Button } from '@components/index';
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
            {profileImage.startsWith('http') ||
            profileImage.startsWith('data:') ||
            profileImage.startsWith('blob:') ? (
              <ProfileImgTag
                src={profileImage}
                alt="프로필"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              profileImage
            )}
          </ModalImage>
        </ModalImageContainer>
        <Button
          buttonText="사진 선택하기"
          type="default"
          onClick={onImageSelect}
          style={{ marginBottom: '0.5rem' }}
        />
        <Button buttonText="취소" type="sub" onClick={onClose} />
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
