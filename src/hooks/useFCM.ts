import { useEffect, useState } from 'react';
import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { messaging } from '@utils/firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!(await isSupported())) {
        console.warn('[FCM] 브라우저 미지원');
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('[FCM] 알림 권한 거부');
        return;
      }

      try {
        // PWA에서 이미 등록된 sw.js 사용
        const registration = await navigator.serviceWorker.ready;
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });
        if (token) {
          console.log('[FCM] Token:', token);
          setFcmToken(token);
        } else {
          console.warn('[FCM] No token available');
        }
      } catch (err) {
        console.error('[FCM] getToken error:', err);
      }

      onMessage(messaging, payload => {
        console.log('[FCM] Foreground message:', payload);
      });
    })();
  }, []);

  return fcmToken;
};
