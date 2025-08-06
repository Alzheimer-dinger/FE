/**
 * ProfileEditPage - 프로필 수정 화면
 *
 * 세부사항:
 * - 사용자가 이름, 현재 비밀번호, 새로운 비밀번호, 성별 수정 가능
 * - 환자/보호자 번호는 읽기 전용
 * - 비밀번호 변경 시 현재 비밀번호와 새로운 비밀번호 모두 필요
 * - Signup.tsx와 일관된 UI/UX 제공
 */

import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackHeader, ContentContainer, Button, Input } from '@components/index';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '홍길동',
    currentPassword: '',
    newPassword: '',
    patientNumber: '22369874',
    gender: 'male' as 'male' | 'female',
  });

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.currentPassword.trim() !== '' &&
    formData.newPassword.trim() !== '' &&
    !currentPasswordError &&
    !newPasswordError;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // 에러 메시지 초기화
    if (field === 'currentPassword') {
      setCurrentPasswordError('');
    } else if (field === 'newPassword') {
      setNewPasswordError('');
    }
  };

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setFormData(prev => ({
      ...prev,
      gender,
    }));
  };

  const validatePasswords = () => {
    let hasError = false;

    if (formData.currentPassword.length < 6) {
      setCurrentPasswordError('현재 비밀번호를 입력해주세요.');
      hasError = true;
    }

    if (formData.newPassword.length < 8) {
      setNewPasswordError('새로운 비밀번호는 8자 이상이어야 합니다.');
      hasError = true;
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.newPassword)) {
      setNewPasswordError('영문과 숫자를 포함해야 합니다.');
      hasError = true;
    }

    return !hasError;
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    if (!validatePasswords()) return;

    // 프로필 수정 로직
    console.log('프로필 수정:', formData);
    navigate('/mypage');
  };

  return (
    <Container>
      <BackHeader title="프로필 수정" />
      <ContentContainer>
        <Title>프로필 수정</Title>
        <Subtitle>변경하고 싶은 정보를 수정해주세요</Subtitle>

        <Form>
          <Label>이름</Label>
          <Input
            type="default"
            placeholder="이름을 입력해주세요"
            value={formData.name}
            inputType="text"
            onChange={e => handleInputChange('name', e.target.value)}
          />

          <Label>현재 비밀번호</Label>
          <Input
            type="default"
            placeholder="현재 비밀번호를 입력해주세요"
            value={formData.currentPassword}
            inputType="password"
            onChange={e => handleInputChange('currentPassword', e.target.value)}
          />
          {currentPasswordError && (
            <ErrorText>{currentPasswordError}</ErrorText>
          )}

          <Label>새로운 비밀번호</Label>
          <Input
            type="default"
            placeholder="새로운 비밀번호를 입력해주세요"
            value={formData.newPassword}
            inputType="password"
            onChange={e => handleInputChange('newPassword', e.target.value)}
          />
          {newPasswordError && <ErrorText>{newPasswordError}</ErrorText>}

          <Label>환자 / 보호자 번호</Label>
          <Input
            type="default"
            placeholder="환자 / 보호자 번호"
            value={formData.patientNumber}
            inputType="text"
            className="readonly"
            onChange={() => {}}
          />

          <Label>성별</Label>
          <GenderContainer>
            <GenderButton
              selected={formData.gender === 'male'}
              onClick={() => handleGenderSelect('male')}
            >
              <GenderIcon>👨🏻</GenderIcon>
              <GenderText>남성</GenderText>
            </GenderButton>
            <GenderButton
              selected={formData.gender === 'female'}
              onClick={() => handleGenderSelect('female')}
            >
              <GenderIcon>👩🏻</GenderIcon>
              <GenderText>여성</GenderText>
            </GenderButton>
          </GenderContainer>
        </Form>

        <Button
          type="default"
          buttonText="수정 완료"
          isDisabled={!isFormValid}
          bgColor={isFormValid ? '#6a1b9a' : '#d9d9d9'}
          onClick={handleSubmit}
        />
      </ContentContainer>
    </Container>
  );
};

export default ProfileEdit;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #6a1b9a;
  text-align: center;
  margin: 1rem 0 0 0;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #a1a1a1;
  text-align: center;
  margin: 0;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 1rem 0 2rem 0;
`;

const Label = styled.p`
  font-size: 0.9rem;
  color: #343a40;
  font-weight: bold;
  margin: 1.5rem 0 0.5rem 0;
`;

const GenderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 1.5rem;
`;

const GenderButton = styled.button<{ selected: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 2px solid ${({ selected }) => (selected ? '#6a1b9a' : '#e0e0e0')};
  border-radius: 8px;
  background: ${({ selected }) => (selected ? '#f3e8fd' : 'white')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #6a1b9a;
    background: #f3e8fd;
  }
`;

const GenderIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const GenderText = styled.span`
  font-size: 0.9rem;
  color: #343a40;
  font-weight: 500;
`;

const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 0.8rem;
  margin: 0.3rem 0 0 0;
`;
