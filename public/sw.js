// FCM SDK 로드
importScripts(
  'https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js',
);

// Firebase 초기화
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

self.addEventListener('install', event => {
  console.log('[SW] Installed', event);
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activated', event);
  self.clients.claim();
});

// 백그라운드 푸시 표시
messaging.onBackgroundMessage(payload => {
  console.log('[SW] Received background message', payload);
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || '알림', {
    body: body || '',
    icon: icon || '/icons/icon-192x192.png',
  });
});
