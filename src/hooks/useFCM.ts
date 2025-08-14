import { useEffect, useState } from 'react';
import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { messaging, app } from '@utils/firebase';

// Installations 직접 확인용
import { getInstallations, getId } from 'firebase/installations';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!(await isSupported())) {
        console.warn('[FCM] 브라우저 미지원');
        return;
      }

      // 1) SW 등록 + 활성화 확실히 대기
      await navigator.serviceWorker.register('/sw.js');
      const registration = await navigator.serviceWorker.ready;
      console.log('[FCM] SW ready →', registration);

      // 2) Installations(FID) 선확인: 여기서 막히면 getToken도 실패
      try {
        const installations = getInstallations(app);
        const fid = await getId(installations);
        console.log('[diag] FID:', fid);
      } catch (e) {
        console.error(
          '[diag] getId(installations) error → Installations 단계에서 막힘',
          e,
        );
      }

      // 3) 권한 요청
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('[FCM] 알림 권한 거부됨');
        return;
      }

      // 4) getToken (반드시 SW ready 사용)
      try {
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
