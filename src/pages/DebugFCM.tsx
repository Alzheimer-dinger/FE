import { useEffect, useState } from 'react';
import { getToken, isSupported } from 'firebase/messaging';
import { app, messaging } from '@utils/firebase';

type SWOptions = { [k: string]: any } | null;

export default function DebugFCM() {
  const [secure, setSecure] = useState<boolean | null>(null);
  const [support, setSupport] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [pageOptions, setPageOptions] = useState<any>(null);
  const [swOptions, setSwOptions] = useState<SWOptions>(null);
  const [vapidPrefix, setVapidPrefix] = useState<string>('');
  const [installationsReachable, setInstallationsReachable] = useState<string>('pending');
  const [tokenResult, setTokenResult] = useState<string>('not-started');

  useEffect(() => {
    (async () => {
      setSecure(window.isSecureContext);
      setSupport(await isSupported());
      setPermission(Notification.permission);
      setPageOptions(app.options);
      setVapidPrefix((import.meta as any).env?.VITE_FIREBASE_VAPID_KEY?.slice(0, 16) || '(missing)');

      // 1) SW에 프로젝트 설정 요청(페이지 콘솔 없이 화면에 뿌림)
      navigator.serviceWorker.controller?.postMessage({ type: 'GET_SW_FIREBASE_OPTIONS' });
      navigator.serviceWorker.addEventListener('message', (e: MessageEvent) => {
        if (e.data?.type === 'SW_FIREBASE_OPTIONS') setSwOptions(e.data.options || null);
      });

      // 2) Installations 도달성 핑 (CSP/프록시 차단 여부 대략 확인)
      try {
        await fetch('https://firebaseinstallations.googleapis.com/.well-known/assetlinks.json', { mode: 'no-cors' });
        setInstallationsReachable('ok (opaque)');
      } catch (e: any) {
        setInstallationsReachable('blocked: ' + (e?.message || e));
      }

      // 3) 실제 토큰 시도
      try {
        const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
        await navigator.serviceWorker.ready;
        if (Notification.permission !== 'granted') {
          const p = await Notification.requestPermission();
          setPermission(p);
          if (p !== 'granted') { setTokenResult('permission denied'); return; }
        }
        const t = await getToken(messaging, { vapidKey: (import.meta as any).env?.VITE_FIREBASE_VAPID_KEY, serviceWorkerRegistration: reg });
        setTokenResult(t ? 'token OK' : 'no token');
      } catch (e: any) {
        setTokenResult('getToken error: ' + (e?.message || e));
      }
    })();
  }, []);

  return (
    <div style={{fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', padding:16, lineHeight:1.5}}>
      <h2>FCM Diagnostics</h2>
      <div>secureContext: <b>{String(secure)}</b></div>
      <div>isSupported: <b>{String(support)}</b></div>
      <div>Notification.permission: <b>{permission}</b></div>
      <div>VAPID key prefix: <b>{vapidPrefix}</b></div>
      <hr/>
      <div><b>[Page] app.options</b></div>
      <pre>{JSON.stringify(pageOptions, null, 2)}</pre>
      <div><b>[Service Worker] app.options</b></div>
      <pre>{JSON.stringify(swOptions, null, 2)}</pre>
      <hr/>
      <div>Installations ping: <b>{installationsReachable}</b></div>
      <div>getToken(): <b>{tokenResult}</b></div>
      <p style={{marginTop:12, color:'#666'}}>이 페이지 스크린샷만 주셔도 진단됩니다.</p>
    </div>
  );
}
