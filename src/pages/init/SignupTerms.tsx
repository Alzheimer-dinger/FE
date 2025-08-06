/**
 * SignupTerms - 회원가입 약관 동의 화면
 *
 * 세부사항:
 * - 사용자가 전체 약관, 개인정보 수집 및 이용, 이용약관(각 필수 항목)에 대한 동의를 선택
 * - '전체동의' 선택 시 개별 항목도 함께 체크되며, 개별 체크 상태에 따라 전체동의 상태도 자동 갱신
 * - 필수 항목 동의 시에만 다음 단계로 이동 가능
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BackHeader, ContentContainer, Button } from '@components/common/index';
import { CheckItem } from '@components/index';

const SignupTerms = () => {
  const navigate = useNavigate();
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);

  const toggleAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreePrivacy(newValue);
    setAgreeTerms(newValue);
  };

  useEffect(() => {
    setAgreeAll(agreePrivacy && agreeTerms);
  }, [agreePrivacy, agreeTerms]);

  const isFormValid = agreePrivacy && agreeTerms;

  const handleNext = () => {
    if (!isFormValid) return;
    navigate('/signup-role');
  };

  return (
    <Container>
      <BackHeader title="회원가입" />
      <ContentContainer>
        <Section>
          <Title>약관동의</Title>
          <Description>
            A-dinger의 서비스를 이용하시려면 아래 약관에 동의가 필요합니다.
          </Description>
        </Section>

        <CheckItem label="전체동의" checked={agreeAll} onClick={toggleAll} />
        <Divider />
        <CheckItem
          label="개인정보 수집 이용 동의 (필수)"
          checked={agreePrivacy}
          onClick={() => setAgreePrivacy(!agreePrivacy)}
        />
        <CheckItem
          label="이용약관 동의 (필수)"
          checked={agreeTerms}
          onClick={() => setAgreeTerms(!agreeTerms)}
        />

        <Button
          type="main"
          buttonText="다음"
          isDisabled={!isFormValid}
          bgColor={isFormValid ? '#6a1b9a' : '#d9d9d9'}
          onClick={handleNext}
          style={{ marginTop: '10rem' }}
        />
      </ContentContainer>
    </Container>
  );
};

export default SignupTerms;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  position: relative;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 2rem 0;
`;

const Title = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #6a1b9a;
  margin: 0;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #a1a1a1;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #d9d9d9;
  margin-bottom: 1.5rem;
`;
