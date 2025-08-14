import { useEffect, useState } from 'react';
import {
  getToken as getFcmToken,
  isSupported,
  onMessage,
} from 'firebase/messaging';
import { messaging } from '@utils/firebase';

// firebaseConfig는 네 utils/firebase에서 initializeApp 한 그 값
// 필요하면 여기서 불러오거나 아래 REST 함수에서 messaging.app.options로 읽음

export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeOnMessage: (() => void) | undefined;

    (async () => {
      try {
        if (!(await isSupported())) return;
        if (!window.isSecureContext) return;
        if (!('Notification' in window)) return;

        const VAPID = (
          import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined
        )?.trim();
        if (!VAPID) {
          console.error('[FCM] Missing VAPID');
          return;
        }

        // SW 등록: 루트 고정
        const reg = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js',
          { scope: '/' },
        );
        await navigator.serviceWorker.ready;

        // 권한
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          console.warn('[FCM] permission not granted');
          return;
        }

        // 푸시 구독(있으면 재사용)
        const sub =
          (await reg.pushManager.getSubscription()) ??
          (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID),
          }));

        // 1) 표준 경로
        try {
          const token = await getFcmToken(messaging, { vapidKey: VAPID });
          if (token) {
            setFcmToken(token);
            console.log('[FCM] getToken OK');
          }
        } catch (e) {
          console.warn('[FCM] getToken failed → try REST fallback', e);

          // 2) REST 우회: FIS → FCM 등록
          const fb = (messaging as any).app?.options || {};
          const apiKey: string | undefined =
            (
              import.meta.env.VITE_FIREBASE_API_KEY as string | undefined
            )?.trim() || fb.apiKey;
          const appId: string | undefined = fb.appId;
          const projectId: string | undefined = fb.projectId;

          if (!apiKey || !appId || !projectId) {
            console.error('[probe] missing apiKey/appId/projectId');
            return;
          }

          // 2-1) Installations 생성 (authToken 획득)
          const fis = await createInstallationViaRest({
            apiKey,
            appId,
            projectId,
          });
          if (!fis?.authToken) {
            console.error('[probe] FIS REST failed');
            return;
          }

          // 2-2) FCM webpush registration
          const fcm = await registerWebpushViaRest({
            apiKey,
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
        }

        // 포그라운드 수신
        unsubscribeOnMessage = onMessage(messaging, payload => {
          console.log('[FCM] foreground message', payload);
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

// Installations REST: https://firebaseinstallations.googleapis.com/v1/projects/{projectId}/installations
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
      // firebase JS SDK 식별자 (대략 맞춰주면 됨)
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
      // expiresIn: json?.authToken?.expiresIn
    };
  } catch {
    console.error('[probe] FIS parse error', text);
    return null;
  }
}

// FCM registrations REST: https://fcmregistrations.googleapis.com/v1/webpush/registrations?key=API_KEY
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

  const url = `https://fcmregistrations.googleapis.com/v1/webpush/registrations?key=${encodeURIComponent(apiKey)}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 중요: FIS auth 토큰을 Authorization 헤더로
      Authorization: `FIS ${fisAuthToken}`,
    },
    body: JSON.stringify(body),
  });

  const text = await resp.text();
  if (!resp.ok) {
    return { status: resp.status, body: text };
  }

  try {
    const json = JSON.parse(text);
    return { token: json?.token as string | undefined };
  } catch {
    return { body: text };
  }
}

// ---- utils
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
