import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@utils/firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    // 서비스워커 등록
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);

        // 알림 권한 요청
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            // FCM 토큰 요청
            getToken(messaging, {
              vapidKey: VAPID_KEY,
              serviceWorkerRegistration: registration,
            })
              .then(token => {
                if (token) {
                  console.log('FCM Token:', token);
                  setFcmToken(token);
                } else {
                  console.warn('No token available');
                }
              })
              .catch(err => console.error('Token error:', err));
          } else {
            console.warn('알림 권한 거부됨');
          }
        });
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });

    onMessage(messaging, payload => {
      console.log('Foreground FCM message:', payload);
    });
  }, []);

  return fcmToken;
};
