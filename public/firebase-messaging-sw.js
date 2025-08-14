importScripts(
  'https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: 'AIzaSyClSEPibfp07m4Qvjix1nJjzEwSEyOJK54',
  authDomain: 'alzheimerdinger-b9e53.firebaseapp.com',
  projectId: 'alzheimerdinger-b9e53',
  storageBucket: 'alzheimerdinger-b9e53.firebasestorage.app',
  messagingSenderId: '832024980689',
  appId: '1:832024980689:web:fead7061b8fe4378ece9f0',
  measurementId: 'G-DE3S7XGP8Q',
});

const messaging = firebase.messaging();

// 새 SW가 즉시 페이지를 제어하도록 보장
self.addEventListener('install', () => {
  self.skipWaiting();
  console.log('[Service Worker] installed');
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  console.log('[Service Worker] activated');
});

// ---- fetch: 진단용 로그
self.addEventListener('fetch', e => {
  console.log('[Service Worker] fetched resource', e.request.url);
});

// ---- 페이지 <-> SW 진단 메시지
self.addEventListener('message', event => {
  if (event?.data?.type === 'GET_SW_FIREBASE_OPTIONS') {
    const options = firebase.app().options;
    event.source?.postMessage({ type: 'SW_FIREBASE_OPTIONS', options });
  }
});

// ---- FCM 백그라운드 메시지
messaging.onBackgroundMessage(payload => {
  console.log('[SW] Received background message', payload);

  const { title, body, icon } = payload.notification || {};
  const notificationTitle = title || '알림';
  const notificationOptions = {
    body: body || '',
    icon: icon || 'icons/icon-24x24.svg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
