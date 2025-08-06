import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import {
  Login,
  SignupTerms,
  SignupRole,
  Signup,
  Call,
  Report,
  Mypage,
  ProfileEdit,
  PatientGuardianManage,
  RecordDetail,
  CallWaiting,
  CallActive,
} from '@pages/index';
import { ScrollToTop } from '@components/common/index';
import { useFCM } from '@hooks/useFCM';

const App = () => {
  // FCM 알림 권한 요청 + 토큰 발급 + 메시지 수신
  useFCM();

  return (
    <Router>
      <Container>
        <ScrollToTop />
        <Routes>
          {/* Init */}
          <Route path="/" element={<Login />} />
          <Route path="/signup-terms" element={<SignupTerms />} />
          <Route path="/signup-role" element={<SignupRole />} />
          <Route path="/signup" element={<Signup />} />

          {/* Call */}
          <Route path="/call" element={<Call />} />
          <Route path="/call-detail/:date" element={<RecordDetail />} />
          <Route path="/call-waiting" element={<CallWaiting />} />
          <Route path="/call-active" element={<CallActive />} />

          {/* Report */}
          <Route path="/report" element={<Report />} />

          {/* MyPage */}
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/edit" element={<ProfileEdit />} />
          <Route path="/manage" element={<PatientGuardianManage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

const Container = styled.div`
  width: 100vw;
  max-width: 425px;
  min-width: 320px;
  justify-content: center;
  align-items: center;
  display: flex;

  // 텍스트 클릭 방지
  user-select: none;
  // 탭 하이라이트 제거
  -webkit-tap-highlight-color: transparent;
`;
