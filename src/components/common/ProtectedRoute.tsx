/**
 * ProtectedRoute - 인증이 필요한 페이지 접근을 보호하는 컴포넌트
 *
 * 기능:
 * - localStorage에서 accessToken 존재 여부 확인
 * - 토큰이 없으면 로그인 페이지(/)로 리다이렉트
 * - 토큰이 있으면 해당 페이지(<Outlet />) 렌더링
 */

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
