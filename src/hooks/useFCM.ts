import { useEffect, useState } from 'react';
import {
  getToken as getFcmToken,
  isSupported,
  onMessage,
} from 'firebase/messaging';
import { messaging } from '@utils/firebase';

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeOnMessage: (() => void) | undefined;

    (async () => {
      try {
        // 환경 체크
        if (!(await isSupported())) {
          console.warn('[FCM] This environment does not support FCM.');
          return;
        }
        if (!window.isSecureContext) {
          console.error('[FCM] Requires HTTPS (secure context).');
          return;
        }
        if (!('Notification' in window)) {
          console.error('[FCM] Notification API not available.');
          return;
        }

        // .env
        const VAPID = (
          import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined
        )?.trim();
        const API_KEY = (
          import.meta.env.VITE_FIREBASE_API_KEY as string | undefined
        )?.trim();
        const APP_ID = (
          import.meta.env.VITE_FIREBASE_APP_ID as string | undefined
        )?.trim();
        const PROJECT_ID = (
          import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined
        )?.trim();

        if (!VAPID) {
          console.error('[FCM] Missing VITE_FIREBASE_VAPID_KEY');
          return;
        }
        if (!API_KEY || !APP_ID || !PROJECT_ID) {
          console.error('[FCM] Missing apiKey/appId/projectId in .env');
          return;
        }

        // SW 등록(루트 고정) & ready
        const reg = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js',
          { scope: '/' },
        );
        console.log('[FCM] SW registered with scope:', reg.scope);
        await navigator.serviceWorker.ready;
        console.log('[FCM] SW ready');

        // 권한
        const perm = await Notification.requestPermission();
        console.log('[FCM] Notification permission:', perm);
        if (perm !== 'granted') {
          console.warn('[FCM] Permission not granted.');
          return;
        }

        // 푸시 구독 보장(있으면 재사용)
        const sub =
          (await reg.pushManager.getSubscription()) ??
          (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID),
          }));
        console.log('[FCM] push subscription OK:', {
          endpoint: sub.endpoint,
          hasAuth: !!sub.getKey('auth'),
          hasP256dh: !!sub.getKey('p256dh'),
        });

        // 1) 표준 경로: registration을 반드시 명시!
        try {
          const token = await getFcmToken(messaging, {
            vapidKey: VAPID,
            serviceWorkerRegistration: reg,
          });
          if (token) {
            console.log('[FCM] getToken OK');
            setFcmToken(token);
            // 표준 경로 성공이면 종료
            return;
          }
          console.warn('[FCM] getToken returned empty.');
        } catch (e) {
          console.warn('[FCM] getToken failed → try REST fallback', e);
        }

        // 2) REST 우회: FIS → FCM registrations
        const fis = await createInstallationViaRest({
          apiKey: API_KEY,
          appId: APP_ID,
          projectId: PROJECT_ID,
        });
        if (!fis?.authToken) {
          console.error('[probe] FIS REST failed');
          return;
        }

        const fcm = await registerWebpushViaRest({
          apiKey: API_KEY,
          fisAuthToken: fis.authToken,
          subscription: sub,
        });

        if (fcm?.token) {
          console.log('[probe] fcmregistrations OK');
          setFcmToken(fcm.token);
        } else {
          console.error(
            '[probe] fcmregistrations FAILED',
            fcm?.status,
            fcm?.body,
          );
        }

        // 포그라운드 메시지
        unsubscribeOnMessage = onMessage(messaging, payload => {
          console.log('[FCM] Foreground message:', payload);
        });
      } catch (err) {
        console.error('[FCM] fatal', err);
      }
    })();

    return () => {
      if (unsubscribeOnMessage) unsubscribeOnMessage();
    };
  }, []);

  return fcmToken;
};

// Installations REST
async function createInstallationViaRest(opts: {
  apiKey: string;
  appId: string;
  projectId: string;
}) {
  const { apiKey, appId, projectId } = opts;
  const url = `https://firebaseinstallations.googleapis.com/v1/projects/${projectId}/installations`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      appId,
      sdkVersion: 'w:12.0.0',
    }),
  });

  const text = await resp.text();
  if (!resp.ok) {
    console.error('[probe] FIS status', resp.status, text);
    return null;
  }

  try {
    const json = JSON.parse(text);
    return {
      fid: json?.fid as string | undefined,
      refreshToken: json?.refreshToken as string | undefined,
      authToken: json?.authToken?.token as string | undefined,
    };
  } catch {
    console.error('[probe] FIS parse error', text);
    return null;
  }
}

// FCM registrations REST
async function registerWebpushViaRest(opts: {
  apiKey: string;
  fisAuthToken: string;
  subscription: PushSubscription;
}) {
  const { apiKey, fisAuthToken, subscription } = opts;

  const body = {
    web: {
      endpoint: subscription.endpoint,
      p256dh: u8ToB64(subscription.getKey('p256dh')!),
      auth: u8ToB64(subscription.getKey('auth')!),
    },
  };

  const url = `https://fcmregistrations.googleapis.com/v1/webpush/registrations?key=${encodeURIComponent(
    apiKey,
  )}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `FIS ${fisAuthToken}`,
    },
    body: JSON.stringify(body),
  });

  const text = await resp.text();
  if (!resp.ok) return { status: resp.status, body: text };

  try {
    const json = JSON.parse(text);
    return { token: json?.token as string | undefined };
  } catch {
    return { body: text };
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
function u8ToB64(key: ArrayBuffer) {
  const arr = new Uint8Array(key);
  let s = '';
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s);
}
