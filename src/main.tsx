import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { createGlobalStyle } from 'styled-components';
import '@utils/setupFetchInterceptor';

// Firebase SDK 디버그 로그
import { setLogLevel } from 'firebase/app';
setLogLevel('debug'); // 'debug'로 SDK 내부 동작(Installations 등) 자세히 출력

// 온라인/오프라인 상태 및 환경 진단
console.log('[diag] origin:', location.origin, 'protocol:', location.protocol);
console.log('[diag] navigator.onLine:', navigator.onLine);
window.addEventListener('online', () => console.log('[diag] back online'));
window.addEventListener('offline', () => console.log('[diag] offline'));

// installations 호스트 접근 자체 테스트(차단 여부만 확인)
fetch('https://firebaseinstallations.googleapis.com/', { mode: 'no-cors' })
  .then(() => console.log('[diag] reach installations host: OK'))
  .catch(e => console.log('[diag] reach installations host: blocked?', e));

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }

  #root {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

createRoot(document.getElementById('root')!).render(
  <>
    <GlobalStyle />
    <App />
  </>,
);
