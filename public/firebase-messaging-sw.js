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

// install event
self.addEventListener('install', () => {
  console.log('[Service Worker] installed');
});

// activate event
self.addEventListener('activate', e => {
  console.log('[Service Worker] actived', e);
});

// fetch event
self.addEventListener('fetch', e => {
  console.log('[Service Worker] fetched resource ' + e.request.url);
});

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );

  const { title, body } = payload.notification;

  const notificationOptions = {
    body,
    icon: 'icons/icon-24x24.svg',
  };

  self.registration.showNotification(title, notificationOptions);

  self.addEventListener('message', event => {
    if (event?.data?.type === 'GET_SW_FIREBASE_OPTIONS') {
      // SW의 firebase.app().options를 페이지로 전달
      const options = firebase.app().options;
      // event.source는 같은 오리진 클라이언트
      event.source?.postMessage({ type: 'SW_FIREBASE_OPTIONS', options });
    }
  });
});
