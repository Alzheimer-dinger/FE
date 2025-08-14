import { useEffect, useState } from 'react';
import { getToken, isSupported, onMessage } from 'firebase/messaging';
import { messaging } from '@utils/firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
const BASE = (import.meta as any).env?.BASE_URL || '/';

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeOnMessage: (() => void) | undefined;

    (async () => {
      try {
        // 0) 환경/브라우저 체크
        if (!(await isSupported())) {
          console.warn('[FCM] This environment does not support FCM.');
          return;
        }
        if (!window.isSecureContext) {
          console.error('[FCM] FCM requires HTTPS (secure context).');
          return;
        }
        if (!('Notification' in window)) {
          console.error('[FCM] Notification API not available.');
          return;
        }
        if (!VAPID_KEY) {
          console.error('[FCM] Missing VAPID key (VITE_FIREBASE_VAPID_KEY).');
          return;
        }

        // 1) 서비스 워커 등록 (배포 베이스에 맞춰 경로/스코프 설정)
        const swUrl = new URL(
          'firebase-messaging-sw.js',
          window.location.origin + BASE,
        ).pathname;
        const registration = await navigator.serviceWorker.register(swUrl, {
          scope: BASE,
        });
        console.log('[FCM] SW registered with scope:', registration.scope);

        // 2) SW 활성화까지 대기 (경합 방지)
        await navigator.serviceWorker.ready;
        console.log('[FCM] SW ready');

        // 3) 알림 권한 요청 (가능하면 버튼 클릭 등 사용자 제스처에서 호출 권장)
        const permission = await Notification.requestPermission();
        console.log('[FCM] Notification permission:', permission);
        if (permission !== 'granted') {
          console.warn('[FCM] Permission not granted.');
          return;
        }

        // 4) 토큰 발급
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });
        if (token) {
          console.log('[FCM] Token:', token);
          setFcmToken(token);
        } else {
          console.warn('[FCM] No token available (getToken returned empty).');
        }

        // 5) 포그라운드 메시지
        unsubscribeOnMessage = onMessage(messaging, payload => {
          console.log('[FCM] Foreground message:', payload);
        });
      } catch (err) {
        console.error('[FCM] getToken error:', err);
      }
    })();

    // 클린업: 포그라운드 리스너 해제
    return () => {
      if (unsubscribeOnMessage) unsubscribeOnMessage();
    };
  }, []);

  return fcmToken;
};
