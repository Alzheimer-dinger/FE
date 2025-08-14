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

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || '알림', {
    body: body || '',
    icon: icon || 'icons/icon-24x24.svg',
  });
});
