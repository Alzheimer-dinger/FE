import { getAccess, getRefresh, saveTokens, clearTokens, Tokens } from './auth';

// 재발급 중복 호출 방지
let refreshInFlight: Promise<Tokens | null> | null = null;

async function refreshAccessToken(): Promise<Tokens | null> {
  const refresh = getRefresh();
  if (!refresh) return null;

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const url = `${import.meta.env.VITE_SERVER_URL}/api/token?refreshToken=${encodeURIComponent(refresh)}`;
        const res = await originalFetch(url, { method: 'POST' });

        if (!res.ok) return null;
        const data = await res.json();

        const next: Tokens | undefined = {
          accessToken: data?.accessToken ?? data?.result?.accessToken,
          refreshToken: data?.refreshToken ?? data?.result?.refreshToken,
        };
        if (!next?.accessToken || !next?.refreshToken) return null;

        saveTokens(next);
        return next;
      } catch {
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

// 원본 fetch 백업
const originalFetch = globalThis.fetch.bind(globalThis);

// 한 번만 패치
if (!(globalThis as any).__FETCH_INTERCEPTOR_INSTALLED__) {
  (globalThis as any).__FETCH_INTERCEPTOR_INSTALLED__ = true;

  globalThis.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    // 입력 정규화
    const req = input instanceof Request ? input : new Request(input, init);

    // 인증/토큰 엔드포인트는 건너뛰기(무한루프 방지)
    const url = new URL(req.url, window.location.origin);
    const isAuthEndpoint =
      url.pathname.startsWith('/api/users/login') ||
      url.pathname.startsWith('/api/users/signup') ||
      url.pathname.startsWith('/api/token');

    // Authorization 자동 부착 (이미 있으면 유지)
    let headers = new Headers(req.headers);
    if (!headers.has('Authorization') && !isAuthEndpoint) {
      const access = getAccess();
      if (access) headers.set('Authorization', `Bearer ${access}`);
    }

    // 새 Request로 실제 호출(본체 보존을 위해 재생성)
    const firstCall = await originalFetch(new Request(req, { headers }));

    // 정상/기타 에러 → 그대로 반환
    if (firstCall.status !== 401 || isAuthEndpoint) return firstCall;

    // 401 → 재발급 시도
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      // 재발급 실패 → 토큰 초기화 및 로그인으로 이동
      clearTokens();
      return firstCall;
    }

    // 재발급 성공 → 새 토큰으로 재시도(헤더 교체)
    const retryHeaders = new Headers(req.headers);
    retryHeaders.set('Authorization', `Bearer ${refreshed.accessToken}`);

    return originalFetch(new Request(req, { headers: retryHeaders }));
  };
}
