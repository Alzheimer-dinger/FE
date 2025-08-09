/**
 * Login - 로그인 화면
 *
 * 세부사항:
 * - 사용자 역할(환자 / 보호자) 선택
 * - 이메일 및 비밀번호 입력 필드
 * - 유효성 검사(형식 및 임시 계정 정보 기반)
 * - api 연동 완료
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ContentContainer, Button, Input } from '@components/common/index';
import { RoleSelector } from '@components/index';
import { validateEmail, validatePassword } from '@utils/validation';
import { useFCM } from '@hooks/useFCM';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'patient' | 'guardian'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const fcmToken = useFCM();

  const isFormFilled = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!isFormFilled || !fcmToken) return;

    if (!validateEmail(email) || !validatePassword(password)) {
      setLoginError('아이디 또는 비밀번호의 형식이 일치하지 않습니다');
      return;
    }

    const payload = {
      email,
      password,
      fcmToken,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/users/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        setLoginError(errorData.message || '로그인에 실패했습니다.');
        return;
      }

      const data = await response.json();
      console.log('로그인 성공:', data);
      const { accessToken, refreshToken } = data.result ?? {};

      if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
        setLoginError('로그인 응답에 토큰이 없습니다.');
        return;
      }
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      navigate('/call');
    } catch (error) {
      console.error('로그인 오류:', error);
      setLoginError('로그인 도중 오류가 발생했습니다.');
    }
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
