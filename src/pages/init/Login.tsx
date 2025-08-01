/**
 * Login - 로그인 화면
 *
 * 세부사항:
 * - 사용자 역할(환자 / 보호자) 선택
 * - 이메일 및 비밀번호 입력 필드
 * - 유효성 검사(형식 및 임시 계정 정보 기반)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ContentContainer, Button, Input } from '@components/common/index';
import { RoleSelector } from '@components/index';
import { validateEmail, validatePassword } from '@utils/validation';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'patient' | 'guardian'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const isFormFilled = email.trim() !== '' && password.trim() !== '';

  // 임시 로그인 유효성 로직
  const isLoginValid = email === 'example@gmail.com' && password === 'test123!';

  const handleLogin = () => {
    if (!isFormFilled) return;

    if (!validateEmail(email) || !validatePassword(password)) {
      setLoginError('아이디 또는 비밀번호의 형식이 일치하지 않습니다');
      return;
    }
    if (!isLoginValid) {
      setLoginError('아이디 또는 비밀번호가 일치하지 않습니다');
      return;
    }
    setLoginError('');
    navigate('/call');
  };

  return (
    <Container>
      <ContentContainer>
        <AppTitle>A-dinger</AppTitle>
        <AppSubtitle>기억과 마음을 연결하는 돌봄 플랫폼</AppSubtitle>
        <RoleSelector role={role} onChange={setRole} />

        <Form>
          <Label>이메일</Label>
          <Input
            type="default"
            placeholder="이메일을 입력해주세요"
            value={email}
            inputType="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              setLoginError('');
            }}
          />
          <Label>비밀번호</Label>
          <Input
            type="default"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            inputType="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setLoginError('');
            }}
          />

          {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
        </Form>

        <Button
          type="main"
          buttonText="로그인"
          isDisabled={!isFormFilled}
          bgColor={isFormFilled ? '#6a1b9a' : '#d9d9d9'}
          onClick={handleLogin}
        />
        <SignUpLink onClick={() => navigate('/signup-terms')}>
          회원가입
        </SignUpLink>
      </ContentContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const AppTitle = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #6a1b9a;
  text-align: center;
  margin: 2rem 0 0 0;
`;

const AppSubtitle = styled.p`
  font-size: 0.8rem;
  color: #a1a1a1;
  text-align: center;
  margin: 0 0 4rem 0;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 2.6rem;
`;

const Label = styled.p`
  font-size: 0.9rem;
  color: #343a40;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const SignUpLink = styled.div`
  margin-top: 3rem;
  font-size: 0.9rem;
  text-align: center;
  color: #a1a1a1;
  text-decoration: underline;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;
