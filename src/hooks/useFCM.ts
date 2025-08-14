import { useEffect, useState } from 'react';
import { getToken, isSupported, onMessage } from 'firebase/messaging';
import { messaging } from '@utils/firebase';

/**
 * FCM 토큰을 발급하고, 포그라운드 메시지를 수신하는 훅
 * - 루트 스코프(/)에 있는 /firebase-messaging-sw.js 를 사용
 * - VAPID 키 공백/개행 문제 방지
 * - 푸시 구독(PushManager.subscribe) 선검증 → 막히면 원인 로그로 바로 확인
 */

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeOnMessage: (() => void) | undefined;

    (async () => {
      try {
        // 0) 환경/브라우저 지원 체크
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

        // 1) VAPID 키 확인 (공백/개행 제거)
        const VAPID_RAW = import.meta.env.VITE_FIREBASE_VAPID_KEY as
          | string
          | undefined;
        const VAPID_KEY = VAPID_RAW?.trim();
        if (!VAPID_KEY) {
          console.error('[FCM] Missing VAPID key (VITE_FIREBASE_VAPID_KEY).');
          return;
        }

        // 2) 서비스워커 등록 (루트 고정 권장)
        const swUrl = '/firebase-messaging-sw.js';
        const registration = await navigator.serviceWorker.register(swUrl, {
          scope: '/',
        });
        console.log('[FCM] SW registered with scope:', registration.scope);

        // 중복/경합 확인용
        const regs = await navigator.serviceWorker.getRegistrations();
        console.log(
          '[FCM] existing SW scopes:',
          regs.map(r => r.scope),
        );

        // SW 활성화 대기
        await navigator.serviceWorker.ready;
        console.log('[FCM] SW ready');

        // 3) 알림 권한 요청
        const permission = await Notification.requestPermission();
        console.log('[FCM] Notification permission:', permission);
        if (permission !== 'granted') {
          console.warn('[FCM] Permission not granted.');
          return;
        }

        // 4) 푸시 구독 선검증
        const appServerKey = urlBase64ToUint8Array(VAPID_KEY);
        try {
          const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: appServerKey,
          });
          console.log('[FCM] push subscribe OK:', {
            endpoint: sub.endpoint,
            hasAuth: !!sub.getKey('auth'),
            hasP256dh: !!sub.getKey('p256dh'),
          });
        } catch (e: any) {
          console.error(
            '[FCM] push subscribe FAILED:',
            e?.name ?? 'Error',
            e?.message ?? e,
          );
          // 흔한 에러:
          // NotAllowedError: 브라우저/OS 알림 차단
          // NotSupportedError: 브라우저/정책이 푸시 미지원
          // AbortError/InvalidStateError: SW/스코프 충돌
          return;
        }

        // 5) 토큰 발급 (SDK가 루트 SW를 스스로 찾게 registration 인자 생략)
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
          console.log('[FCM] Token:', token);
          setFcmToken(token);
        } else {
          console.warn('[FCM] No token available (getToken returned empty).');
        }

        // 6) 포그라운드 메시지 핸들러
        unsubscribeOnMessage = onMessage(messaging, payload => {
          console.log('[FCM] Foreground message:', payload);
        });
      } catch (err) {
        console.error('[FCM] getToken error:', err);
      }
    })();

    return () => {
      if (unsubscribeOnMessage) unsubscribeOnMessage();
    };
  }, []);

  return fcmToken;
};

/** Base64URL → Uint8Array */
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
