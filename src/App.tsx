import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import {
  Login,
  SignupTerms,
  Role,
  Signup,
  Call,
  Report,
  Mypage,
} from '@pages/index';
import { ScrollToTop } from '@components/common/index';

const App = () => (
  <Router>
    <Container>
      <ScrollToTop />
      <Routes>
        {/* Init */}
        <Route path="/" element={<Login />} />
        <Route path="/signup-terms" element={<SignupTerms />} />
        <Route path="/signup-role" element={<Role />} />
        <Route path="/signup" element={<Signup />} />

        {/* Call */}
        <Route path="/call" element={<Call />} />

        {/* Report */}
        <Route path="/report" element={<Report />} />

        {/* MyPage */}
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </Container>
  </Router>
);

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
