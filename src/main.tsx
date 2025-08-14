import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { createGlobalStyle } from 'styled-components';
// import '@utils/setupFetchInterceptor';

(async () => {
  try {
    // IndexedDB 테스트
    const openReq = indexedDB.open('___probe', 1);
    await new Promise((res, rej) => {
      openReq.onerror = () => rej(openReq.error);
      openReq.onsuccess = () => res(null);
    });
    console.log('[diag] IndexedDB OK');
  } catch (e) {
    console.error('[diag] IndexedDB FAILED:', e);
  }

  // Installations API 직접 호출
  try {
    const projectId = 'alzheimerdinger-b9e53';
    const url = `https://firebaseinstallations.googleapis.com/v1/projects/${projectId}/installations`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Firebase API Key
        'x-goog-api-key': 'AIzaSyClSEPibfp07m4Qvjix1nJjzEwSEyOJK54',
      },
      body: JSON.stringify({
        appId: '1:832024980689:web:fead7061b8fe4378ece9f0',
        sdkVersion: 'w:12.0.0', // firebase SDK 버전
      }),
    });
    console.log('[diag] Installations API status:', resp.status);
    console.log('[diag] Installations API body:', await resp.text());
  } catch (err) {
    console.error('[diag] Installations API error:', err);
  }
})();

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
