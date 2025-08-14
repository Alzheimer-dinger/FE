import { useEffect, useState } from 'react';
import {
  getToken as getFcmToken,
  isSupported,
  onMessage,
} from 'firebase/messaging';
import {
  getInstallations,
  getToken as getFisToken,
} from 'firebase/installations';
import { messaging, app as firebaseApp } from '@utils/firebase';

/**
 * 1) 표준 getToken()으로 시도
 * 2) 실패 시, 수동 흐름(푸시 구독 → FIS 토큰 → fcmregistrations POST)으로 FCM 토큰 획득 시도
 */
export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeOnMessage: (() => void) | undefined;

    (async () => {
      try {
        // --- 환경 체크
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

        // --- VAPID 키 확보 (공백/개행 제거)
        const VAPID_RAW = import.meta.env.VITE_FIREBASE_VAPID_KEY as
          | string
          | undefined;
        const VAPID_KEY = VAPID_RAW?.trim();
        if (!VAPID_KEY) {
          console.error('[FCM] Missing VAPID key (VITE_FIREBASE_VAPID_KEY).');
          return;
        }

        // --- SW 등록 (루트 고정)
        const swUrl = '/firebase-messaging-sw.js';
        const registration = await navigator.serviceWorker.register(swUrl, {
          scope: '/',
        });
        console.log('[FCM] SW registered with scope:', registration.scope);
        await navigator.serviceWorker.ready;
        console.log('[FCM] SW ready');

        // --- 권한
        const permission = await Notification.requestPermission();
        console.log('[FCM] Notification permission:', permission);
        if (permission !== 'granted') {
          console.warn('[FCM] Permission not granted.');
          return;
        }

        // --- 우선 푸시 구독(수동 경로에서도 필요)
        const sub = await ensurePushSubscribed(registration, VAPID_KEY);
        if (!sub) return; // 실패 로그는 함수 내부에서 출력

        // --- 1차: 표준 getToken
        try {
          const token = await getFcmToken(messaging, { vapidKey: VAPID_KEY });
          if (token) {
            console.log('[FCM] getToken OK:', token);
            setFcmToken(token);
          } else {
            console.warn('[FCM] getToken returned empty.');
          }
        } catch (e: any) {
          console.error('[FCM] getToken error:', e);

          // --- 2차: 수동 경로(진단 + 우회)
          const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as
            | string
            | undefined;
          if (!apiKey) {
            console.error(
              '[FCM] Missing API key (VITE_FIREBASE_API_KEY). Cannot try manual registration.',
            );
            return;
          }

          try {
            const fisToken = await getFisAuthToken(firebaseApp);
            if (!fisToken) {
              console.error('[probe] No FIS auth token. Abort.');
              return;
            }

            const manual = await manualWebpushRegistration(
              sub,
              fisToken,
              apiKey,
            );
            if (manual.ok) {
              console.log('[probe] fcmregistrations OK:', manual.token);
              setFcmToken(manual.token!);
            } else {
              console.error(
                '[probe] fcmregistrations FAILED:',
                manual.status,
                manual.body,
              );
            }
          } catch (err) {
            console.error('[probe] manual registration error:', err);
          }
        }

        // --- 포그라운드 메시지
        unsubscribeOnMessage = onMessage(messaging, payload => {
          console.log('[FCM] Foreground message:', payload);
        });
      } catch (err) {
        console.error('[FCM] fatal error:', err);
      }
    })();

    return () => {
      if (unsubscribeOnMessage) unsubscribeOnMessage();
    };
  }, []);

  return fcmToken;
};

/** PushManager.subscribe 보장 + 상세 로그 */
async function ensurePushSubscribed(
  registration: ServiceWorkerRegistration,
  vapidKey: string,
) {
  try {
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
      console.log('[FCM] push already subscribed:', {
        endpoint: existing.endpoint,
        hasAuth: !!existing.getKey('auth'),
        hasP256dh: !!existing.getKey('p256dh'),
      });
      return existing;
    }

    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
    console.log('[FCM] push subscribe OK:', {
      endpoint: sub.endpoint,
      hasAuth: !!sub.getKey('auth'),
      hasP256dh: !!sub.getKey('p256dh'),
    });
    return sub;
  } catch (e: any) {
    console.error(
      '[FCM] push subscribe FAILED:',
      e?.name ?? 'Error',
      e?.message ?? e,
    );
    return null;
  }
}

/** FIS auth 토큰 획득 (Installations) */
async function getFisAuthToken(app: any) {
  const installations = getInstallations(app);
  try {
    const token = await getFisToken(installations, /* forceRefresh */ true);
    console.log('[probe] FIS token OK (length):', token?.length);
    return token;
  } catch (e) {
    console.error('[probe] FIS token FAILED:', e);
    return null;
  }
}

/** fcmregistrations 수동 호출 */
async function manualWebpushRegistration(
  sub: PushSubscription,
  fisToken: string,
  apiKey: string,
): Promise<{ ok: boolean; status?: number; body?: string; token?: string }> {
  // body 구성
  const body = {
    web: {
      endpoint: sub.endpoint,
      p256dh: b64(sub.getKey('p256dh')!),
      auth: b64(sub.getKey('auth')!),
    },
  };

  const url = `https://fcmregistrations.googleapis.com/v1/webpush/registrations?key=${encodeURIComponent(
    apiKey,
  )}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 핵심: FIS 토큰을 Authorization 헤더로
      Authorization: `FIS ${fisToken}`,
    },
    body: JSON.stringify(body),
  });

  const text = await resp.text();

  // 성공 시 응답에 FCM token 포함
  if (resp.ok) {
    try {
      const json = JSON.parse(text);
      const token = json?.token as string | undefined;
      return { ok: true, token };
    } catch {
      return { ok: true, body: text };
    }
  }

  return { ok: false, status: resp.status, body: text };
}

/** util: Base64 encode Uint8Array */
function b64(key: ArrayBuffer) {
  const arr = new Uint8Array(key);
  let s = '';
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s);
}

/** util: Base64URL → Uint8Array */
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
