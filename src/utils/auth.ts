export type Tokens = { accessToken: string; refreshToken: string };

const ACCESS = 'accessToken';
const REFRESH = 'refreshToken';

export const getAccess = () => localStorage.getItem(ACCESS);
export const getRefresh = () => localStorage.getItem(REFRESH);
export const saveTokens = (t: Tokens) => {
  localStorage.setItem(ACCESS, t.accessToken);
  localStorage.setItem(REFRESH, t.refreshToken);
};
export const clearTokens = () => {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
};
