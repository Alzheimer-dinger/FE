import styled from 'styled-components';
import {
  BottomNav,
  DefaultHeader,
} from '@components/common/index';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Picker from 'react-mobile-picker';

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
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setShowImageModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Picker 데이터
  const hourOptions = Array.from({length: 12}, (_, i) => String(i+1));
  const minuteOptions = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
  const periodOptions = ['오전', '오후'];

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
          <SettingItem>
            <SettingIcon style={{ background: '#e3f2fd' }}>👤</SettingIcon>
            <SettingText onClick={handleProfileEditClick}>프로필 수정</SettingText>
            <ArrowIcon>›</ArrowIcon>
          </SettingItem>
          
          <SettingItem>
            <SettingIcon style={{ background: '#e8f5e8' }}>🔔</SettingIcon>
            <SettingText>알림설정</SettingText>
            <ToggleSwitch onClick={() => setAlarmOn((prev) => !prev)} $on={alarmOn}>
              <ToggleSlider $on={alarmOn} />
            </ToggleSwitch>
          </SettingItem>
          
          <SettingItem onClick={() => setShowTimeModal(true)}>
            <SettingIcon style={{ background: '#ffebee' }}>⏰</SettingIcon>
            <SettingText>리마인드 시간</SettingText>
            {remindTime && <RemindTimeText>{remindTime}</RemindTimeText>}
          </SettingItem>
          
          <SettingItem>
            <SettingIcon style={{ background: '#e3f2fd' }}>🛡️</SettingIcon>
            <SettingText>등록된 환자/보호자</SettingText>
            <ArrowIcon>›</ArrowIcon>
          </SettingItem>
          
          <SettingItem>
            <SettingIcon style={{ background: '#fff3e0' }}>❓</SettingIcon>
            <SettingText>피드백 등록</SettingText>
            <ArrowIcon>›</ArrowIcon>
          </SettingItem>
          
          <SettingItem>
            <SettingIcon style={{ background: '#e8f5e8' }}>⚙️</SettingIcon>
            <SettingText>로그아웃</SettingText>
            <ArrowIcon>›</ArrowIcon>
          </SettingItem>
        </SettingsList>
      </ContentContainer>
      <BottomNav />
      
      {/* 프로필 이미지 수정 모달 */}
      {showImageModal && (
        <ModalOverlay onClick={() => setShowImageModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
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
            <ModalButton onClick={handleImageSelect}>
              사진 선택하기
            </ModalButton>
            <ModalCancelButton onClick={() => setShowImageModal(false)}>
              취소
            </ModalCancelButton>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* 리마인드 시간 모달 */}
      {showTimeModal && (
        <TimeModalOverlay>
          <TimeModalContent onClick={e => e.stopPropagation()}>
            <Picker
              value={remindTimeValue}
              onChange={setRemindTimeValue}
              height={180}
              itemHeight={36}
            >
              <PickerColumnWrapper>
                <Picker.Column name="hour">
                  {hourOptions.map(h => (
                    <Picker.Item value={h} key={h}>{h}</Picker.Item>
                  ))}
                </Picker.Column>
              </PickerColumnWrapper>
              <PickerColumnWrapper>
                <Picker.Column name="minute">
                  {minuteOptions.map(m => (
                    <Picker.Item value={m} key={m}>{m}</Picker.Item>
                  ))}
                </Picker.Column>
              </PickerColumnWrapper>
              <PickerColumnWrapper>
                <Picker.Column name="period">
                  {periodOptions.map(p => (
                    <Picker.Item value={p} key={p}>{p}</Picker.Item>
                  ))}
                </Picker.Column>
              </PickerColumnWrapper>
            </Picker>
            <SelectedTimeText>
              선택된 시간 : {remindTimeValue.period} {remindTimeValue.hour}:{remindTimeValue.minute}
            </SelectedTimeText>
            <TimeModalButtonRow>
              <TimeModalButton onClick={() => {
                setRemindTime(`${remindTimeValue.period} ${remindTimeValue.hour}:${remindTimeValue.minute}`);
                setShowTimeModal(false);
              }}>선택</TimeModalButton>
              <TimeModalButtonGray onClick={() => {
                setRemindTime(null);
                setShowTimeModal(false);
              }}>해제</TimeModalButtonGray>
            </TimeModalButtonRow>
          </TimeModalContent>
        </TimeModalOverlay>
      )}
      
      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Container>
  );
};

export default Mypage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: white;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  background: white;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #424242;
  margin: 0 0 24px 0;
  font-weight: 600;
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
  transition: transform 0.2s, box-shadow 0.2s;
  
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

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #fafafa;
  }
`;

const SettingIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 16px;
`;

const SettingText = styled.span`
  flex: 1;
  font-size: 1rem;
  color: #212121;
  font-weight: 500;
`;

const ArrowIcon = styled.span`
  color: #bdbdbd;
  font-size: 1.2rem;
  font-weight: 300;
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
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 80%;
  max-width: 300px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2rem;
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

const RemindTimeText = styled.span`
  margin-left: 8px;
  color: #6c3cff;
  font-size: 0.95rem;
`;

const TimeModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.2);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimeModalContent = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 32px 24px 24px 24px;
  min-width: 260px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SelectedTimeText = styled.div`
  color: #b266ff;
  font-size: 1rem;
  margin-bottom: 16px;
`;

const TimeModalButtonRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const TimeModalButton = styled.button`
  flex: 1;
  background: #6c3cff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const TimeModalButtonGray = styled.button`
  flex: 1;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const PickerColumnWrapper = styled.div`
  margin: 0 16px;
`;
