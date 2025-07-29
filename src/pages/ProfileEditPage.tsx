import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '@components/common/Header/BackHeader';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '홍길동',
    currentPassword: '',
    newPassword: '',
    patientNumber: '22369874',
    gender: 'male'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
  };

  const handleSubmit = () => {
    // 프로필 수정 로직
    console.log('프로필 수정:', formData);
    navigate('/mypage');
  };

  const isFormValid = formData.currentPassword && formData.newPassword;

  return (
    <Container>
      <BackHeader title="프로필 수정" />
      
      <ContentContainer>
        <FormSection>
          <InputGroup>
            <Label>성함</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>현재 비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>새로운 비밀번호</Label>
            <Input
              type="password"
              placeholder="새로운 비밀번호를 입력해주세요"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>환자 / 보호자 번호</Label>
            <Input
              type="text"
              value={formData.patientNumber}
              readOnly
              className="readonly"
            />
          </InputGroup>

          <InputGroup>
            <Label>성별</Label>
            <GenderButtons>
              <GenderButton
                selected={formData.gender === 'male'}
                onClick={() => handleGenderSelect('male')}
              >
                <GenderIcon>👨</GenderIcon>
                <GenderText>남성</GenderText>
              </GenderButton>
              <GenderButton
                selected={formData.gender === 'female'}
                onClick={() => handleGenderSelect('female')}
              >
                <GenderIcon>👩</GenderIcon>
                <GenderText>여성</GenderText>
              </GenderButton>
            </GenderButtons>
          </InputGroup>
        </FormSection>

        <SubmitButton 
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          수정 완료
        </SubmitButton>
      </ContentContainer>
    </Container>
  );
};

export default ProfileEditPage;

const Container = styled.div`
  width: 100vw;
  max-width: 425px;
  min-width: 320px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 24px 20px;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: #424242;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
  
  &::placeholder {
    color: #bdbdbd;
  }
  
  &:focus {
    outline: none;
    border-color: #6c3cff;
  }
  &.readonly:focus {
    border-color: #e0e0e0;
  }
`;

const GenderButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const GenderButton = styled.button<{ selected: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  height: 48px;
  border: 2px solid ${({ selected }) => selected ? '#2196f3' : '#e0e0e0'};
  border-radius: 8px;
  background: ${({ selected }) => selected ? '#e3f2fd' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  
  &:hover {
    border-color: #2196f3;
    background: #e3f2fd;
  }
`;

const GenderIcon = styled.div`
  font-size: 1.3rem;
  margin-right: 8px;
`;

const GenderText = styled.span`
  font-size: 0.95rem;
  color: #424242;
  font-weight: 500;
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  background: ${({ disabled }) => disabled ? '#f5f5f5' : '#6c3cff'};
  color: ${({ disabled }) => disabled ? '#bdbdbd' : 'white'};
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #5a2fd8;
  }
`; 