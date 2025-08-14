import { useEffect, useState } from 'react';
import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { messaging } from '@utils/firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!(await isSupported())) {
        console.warn('[FCM] 브라우저가 FCM을 지원하지 않음');
        return;
      }

      try {
        // 새 SW 등록
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[FCM] Service Worker registered:', registration);

        // 알림 권한 요청
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('[FCM] 알림 권한 거부됨');
          return;
        }

        // 토큰 발급
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (token) {
          console.log('[FCM] Token:', token);
          setFcmToken(token);
        } else {
          console.warn('[FCM] 토큰 없음');
        }

        // 포그라운드 메시지 수신
        onMessage(messaging, payload => {
          console.log('[FCM] Foreground message:', payload);
        });
      } catch (err) {
        console.error('[FCM] getToken error:', err);
      }
    })();
  }, []);

  return fcmToken;
};
