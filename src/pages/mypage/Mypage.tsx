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
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  logoutUser,
  submitFeedback,
  getProfileImageUploadUrl,
  updateProfileImage,
  getReminder,
  setReminder,
  getRelations,
  getUserProfile,
} from '@services/api';

const Mypage = () => {
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);
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

  // 프로필 정보 상태
  const [profileInfo, setProfileInfo] = useState({
    name: '홍길동',
    email: 'abcd1234@abc.com',
  });

  const [profileImage, setProfileImage] = useState('☁️'); // 기본 이미지: 구름

  // 컴포넌트 마운트 시 프로필 정보 및 리마인더 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 프로필 정보 조회
        const profile = await getUserProfile();
        setProfileInfo({
          name: profile.name,
          email: profile.email,
        });

        // 프로필 이미지 설정
        if (profile.imageUrl) {
          const url = String(profile.imageUrl).trim();
          setProfileImage(url);
        } else {
          setProfileImage('☁️'); // 이미지 URL이 없으면 기본 구름
        }

        // 리마인더 조회
        const reminderData = await getReminder();
        if (reminderData && reminderData.status === 'ACTIVE') {
          const raw = (
            reminderData.fireTime ||
            reminderData.time ||
            ''
          ).toString();
          const [hStr, mStr] = raw.split(':');
          if (hStr && mStr) {
            let h = parseInt(hStr, 10);
            const period = h >= 12 ? '오후' : '오전';
            const displayHour = h % 12 || 12; // 0 -> 12 처리
            const mm = mStr.padStart(2, '0');
            setRemindTime(`${period} ${displayHour}:${mm}`);
          } else {
            setRemindTime(null);
          }
        } else {
          setRemindTime(null);
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        alert('서버 연결에 실패했습니다');
      } finally {
      }
    };

    fetchData();
  }, []);

  const handleProfileEditClick = () => {
    navigate('/mypage/edit');
  };

  const handleProfileImageClick = () => {
    setShowImageModal(true);
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const ext = (file.name.split('.').pop() || 'png').toLowerCase();
        const {
          uploadUrl,
          fileKey: presignedFileKey,
          key: presignedKey,
          id: presignedId,
        } = await getProfileImageUploadUrl(ext);
        console.log('[ProfileUpload] presigned URL received', {
          uploadUrl,
          fileKey: presignedFileKey || presignedKey || presignedId,
          ext,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });
        const urlObj = new URL(uploadUrl);
        const urlQueryKey =
          urlObj.searchParams.get('fileKey') ||
          urlObj.searchParams.get('key') ||
          undefined;
        // pathname 기반 키 추출 (S3/GCS 호환)
        const rawPath = decodeURIComponent(urlObj.pathname.replace(/^\/+/, ''));
        const firstPathSegment = rawPath.split('/')[0] || '';
        const pathCandidates = [
          rawPath,
          rawPath.split('/').slice(1).join('/'),
        ].filter(Boolean);
        const pathDerivedKey =
          pathCandidates.find(
            p => p.endsWith(file.name) || p.endsWith(`.${ext}`),
          ) || pathCandidates[0];
        console.log('[ProfileUpload] derived keys from URL', {
          urlQueryKey,
          pathDerivedKey,
          host: urlObj.hostname,
          pathname: urlObj.pathname,
        });
        // 대부분의 사전서명 URL(GCS/S3)은 파일 원본을 PUT으로 업로드하고 Content-Type을 지정합니다.
        console.log('[ProfileUpload][PUT] start upload', {
          to: uploadUrl,
          method: 'PUT',
          contentType: file.type || 'application/octet-stream',
        });
        const t0 = performance.now();
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        const t1 = performance.now();
        console.log('[ProfileUpload][PUT] done', {
          ok: uploadResponse.ok,
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          durationMs: Math.round(t1 - t0),
        });

        if (uploadResponse.ok) {
          // URL 기반 키를 우선 사용하고, 이후 서버 제공 키를 고려합니다
          let fileKey =
            urlQueryKey ||
            pathDerivedKey ||
            presignedFileKey ||
            presignedKey ||
            presignedId;
          if (!fileKey) {
            try {
              const uploadResult = await uploadResponse.clone().json();
              fileKey =
                uploadResult.fileKey || uploadResult.key || uploadResult.id;
              console.log(
                '[ProfileUpload][PUT] parsed upload body for key',
                uploadResult,
              );
            } catch {}
          }
          // 버킷명이 포함된 키라면 제거 (path-style URL 대응)
          if (
            fileKey &&
            firstPathSegment &&
            fileKey.startsWith(firstPathSegment + '/')
          ) {
            const stripped = fileKey.slice(firstPathSegment.length + 1);
            if (
              stripped &&
              (stripped.endsWith(file.name) || stripped.endsWith('.' + ext))
            ) {
              console.log('[ProfileUpload] stripping bucket prefix from key', {
                before: fileKey,
                after: stripped,
                bucket: firstPathSegment,
              });
              fileKey = stripped;
            }
          }
          if (!fileKey) throw new Error('파일 키를 찾을 수 없습니다.');
          console.log(
            '[ProfileUpload][POST] updateProfileImage with fileKey',
            fileKey,
          );
          const updated = await updateProfileImage(fileKey);
          if (updated?.imageUrl) {
            setProfileImage(updated.imageUrl);
          } else {
            const reader = new FileReader();
            reader.onload = e => {
              const result = e.target?.result as string;
              setProfileImage(result);
            };
            reader.readAsDataURL(file);
          }
          setShowImageModal(false);
        } else {
          throw new Error('파일 업로드에 실패했습니다.');
        }
      } catch (error) {
        console.error('프로필 이미지 업로드 실패:', error);
        alert('프로필 이미지 업로드에 실패했습니다.');
      }
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedRating || !feedbackReason.trim()) {
      alert('평점과 이유를 모두 입력해주세요.');
      return;
    }

    try {
      await submitFeedback(selectedRating, feedbackReason);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setShowFeedbackModal(false);
      setSelectedRating('');
      setFeedbackReason('');
    } catch (error) {
      console.error('피드백 전송 실패:', error);
      alert('피드백 전송에 실패했습니다.');
    }
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedRating('');
    setFeedbackReason('');
  };

  const handleReminderDeactivate = async () => {
    try {
      await setReminder(null); // INACTIVE로 설정
      setRemindTime(null);
    } catch (error) {
      console.error('리마인더 해제 실패:', error);
      alert('리마인더 해제에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      // 로그아웃 성공 후 초기 화면으로 이동
      navigate('/');
      setShowLogoutModal(false);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 초기 화면으로 이동
      navigate('/');
      setShowLogoutModal(false);
    }
  };

  return (
    <Container>
      <DefaultHeader showIcon={false} />
      <ContentContainer navMargin={true}>
        <ProfileSection>
          <ProfileImage onClick={handleProfileImageClick}>
            {profileImage.startsWith('http') ||
            profileImage.startsWith('data:') ||
            profileImage.startsWith('blob:') ? (
              <ProfileImgTag
                src={profileImage}
                alt="프로필"
                onError={() => setProfileImage('☁️')}
              />
            ) : (
              <ProfileCharacter>{profileImage}</ProfileCharacter>
            )}
          </ProfileImage>
          <ProfileInfo>
            <ProfileName>{profileInfo.name}</ProfileName>
            <ProfileEmail>{profileInfo.email}</ProfileEmail>
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
              remindTime ? (
                <RemindTimeContainer>
                  <RemindTimeText>{remindTime}</RemindTimeText>
                  <DeactivateButton
                    onClick={e => {
                      e.stopPropagation();
                      handleReminderDeactivate();
                    }}
                  >
                    해제
                  </DeactivateButton>
                </RemindTimeContainer>
              ) : null
            }
          />

          <SettingItem
            icon="🛡️"
            iconBgColor="#e3f2fd"
            text="등록된 환자/보호자"
            onClick={async () => {
              try {
                // 관계 목록을 미리 조회하여 상태로 저장
                const relations = await getRelations();
                // 관계 데이터를 로컬 스토리지나 상태로 저장하여 다음 화면에서 사용
                localStorage.setItem('relations', JSON.stringify(relations));
                navigate('/manage');
              } catch (error) {
                console.error('관계 목록 조회 실패:', error);
                // 조회 실패해도 화면 이동
                navigate('/manage');
              }
            }}
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
        onConfirm={async () => {
          const { period, hour, minute } = remindTimeValue;
          // 화면 표시용(오전/오후)
          const displayTime = `${period} ${hour}:${minute}`;
          // API 전송용(로컬 HH:mm)
          let h = parseInt(hour, 10);
          if (period === '오전' && h === 12) h = 0; // 12AM -> 00
          if (period === '오후' && h !== 12) h += 12; // PM add 12 except 12PM
          const apiTime = `${String(h).padStart(2, '0')}:${minute}`;
          try {
            await setReminder(apiTime);
            setRemindTime(displayTime);
            setShowTimeModal(false);
          } catch (error) {
            console.error('리마인더 설정 실패:', error);
            alert('리마인더 설정에 실패했습니다.');
          }
        }}
        onCancel={async () => {
          try {
            await setReminder(null);
            setRemindTime(null);
            setShowTimeModal(false);
          } catch (error) {
            console.error('리마인더 해제 실패:', error);
            alert('리마인더 해제에 실패했습니다.');
          }
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
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
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
  width: 100%;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
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

const RemindTimeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RemindTimeText = styled.span`
  color: #6c3cff;
  font-size: 0.95rem;
`;

const DeactivateButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #ff5252;
  }
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
