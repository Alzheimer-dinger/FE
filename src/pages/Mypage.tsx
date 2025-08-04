import styled from 'styled-components';
import {
  BottomNav,
  DefaultHeader,
  ContentContainer,
  ProfileImageModal,
  TimePickerModal,
  FeedbackModal,
  LogoutModal,
  SettingItem,
} from '@components/index';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Mypage = () => {
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);
  const [profileImage, setProfileImage] = useState('☁️');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alarmOn, setAlarmOn] = useState(true);

  // 리마인드 시간 관련 상태
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [remindTimeValue, setRemindTimeValue] = useState({
    hour: '7',
    minute: '00',
    period: '오전',
  });
  const [remindTime, setRemindTime] = useState<string | null>(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [feedbackReason, setFeedbackReason] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleProfileEditClick = () => {
    navigate('/mypage/edit');
  };

  const handleProfileImageClick = () => {
    setShowImageModal(true);
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setShowImageModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedRating || !feedbackReason.trim()) {
      alert('평점과 이유를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: selectedRating,
          reason: feedbackReason,
        }),
      });

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setShowFeedbackModal(false);
        setSelectedRating('');
        setFeedbackReason('');
      } else {
        alert('피드백 전송에 실패했습니다.');
      }
    } catch {
      alert('피드백 전송에 실패했습니다.');
    }
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedRating('');
    setFeedbackReason('');
  };

  const handleLogout = () => {
    // 로그아웃 로직 구현
    console.log('로그아웃 실행');
    // 여기에 실제 로그아웃 로직 추가
  };

  return (
    <Container>
      <DefaultHeader showIcon={false} />
      <ContentContainer>
        <ProfileSection>
          <ProfileImage onClick={handleProfileImageClick}>
            {profileImage.startsWith('data:image') ? (
              <ProfileImgTag src={profileImage} alt="프로필" />
            ) : (
              <ProfileCharacter>{profileImage}</ProfileCharacter>
            )}
          </ProfileImage>
          <ProfileInfo>
            <ProfileName>홍길동</ProfileName>
            <ProfileEmail>abcd1234@gmail.com</ProfileEmail>
          </ProfileInfo>
        </ProfileSection>

        <SettingsList>
          <SettingItem
            icon="👤"
            iconBgColor="#e3f2fd"
            text="프로필 수정"
            onClick={handleProfileEditClick}
            showArrow={true}
          />

          <SettingItem
            icon="🔔"
            iconBgColor="#e8f5e8"
            text="알림설정"
            rightElement={
              <ToggleSwitch
                onClick={e => {
                  e.stopPropagation();
                  setAlarmOn(prev => !prev);
                }}
                $on={alarmOn}
              >
                <ToggleSlider $on={alarmOn} />
              </ToggleSwitch>
            }
          />

          <SettingItem
            icon="⏰"
            iconBgColor="#ffebee"
            text="리마인드 시간"
            onClick={() => setShowTimeModal(true)}
            rightElement={
              remindTime && <RemindTimeText>{remindTime}</RemindTimeText>
            }
          />

          <SettingItem
            icon="🛡️"
            iconBgColor="#e3f2fd"
            text="등록된 환자/보호자"
            onClick={() => navigate('/manage')}
            showArrow={true}
          />

          <SettingItem
            icon="❓"
            iconBgColor="#fff3e0"
            text="피드백 등록"
            onClick={() => setShowFeedbackModal(true)}
            showArrow={true}
          />

          <SettingItem
            icon="⚙️"
            iconBgColor="#e8f5e8"
            text="로그아웃"
            onClick={() => setShowLogoutModal(true)}
            showArrow={true}
          />
        </SettingsList>
      </ContentContainer>
      <BottomNav />

      {/* 모달 컴포넌트들 */}
      <ProfileImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        profileImage={profileImage}
        onImageSelect={handleImageSelect}
      />

      <TimePickerModal
        isOpen={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        timeValue={remindTimeValue}
        onTimeChange={setRemindTimeValue}
        onConfirm={() => {
          setRemindTime(
            `${remindTimeValue.period} ${remindTimeValue.hour}:${remindTimeValue.minute}`,
          );
          setShowTimeModal(false);
        }}
        onCancel={() => {
          setRemindTime(null);
          setShowTimeModal(false);
        }}
      />

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleCloseFeedbackModal}
        selectedRating={selectedRating}
        feedbackReason={feedbackReason}
        onRatingChange={setSelectedRating}
        onReasonChange={setFeedbackReason}
        onSubmit={handleFeedbackSubmit}
      />

      {/* 토스트 메시지 */}
      {showToast && <ToastMessage>전송이 완료되었습니다.</ToastMessage>}

      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </Container>
  );
};

export default Mypage;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ProfileSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #e3f2fd;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(1.02);
  }
`;

const ProfileCharacter = styled.div`
  font-size: 2.5rem;
`;

const ProfileImgTag = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: 1.3rem;
  color: #212121;
  margin: 0 0 4px 0;
  font-weight: 600;
`;

const ProfileEmail = styled.p`
  font-size: 0.9rem;
  color: #757575;
  margin: 0;
`;

const SettingsList = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ToggleSwitch = styled.div<{ $on: boolean }>`
  width: 44px;
  height: 24px;
  background: ${({ $on }) => ($on ? '#6c3cff' : '#e0e0e0')};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
`;

const ToggleSlider = styled.div<{ $on: boolean }>`
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${({ $on }) => ($on ? '22px' : '2px')};
  transition: left 0.2s;
`;

const RemindTimeText = styled.span`
  margin-left: 8px;
  color: #6c3cff;
  font-size: 0.95rem;
`;

const ToastMessage = styled.div`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  z-index: 3000;
`;
