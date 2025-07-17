import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 새로운 경로로 이동할 때마다 스크롤을 맨 위로
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
