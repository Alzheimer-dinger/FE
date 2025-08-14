const API_URL = `${import.meta.env.VITE_SERVER_URL}/`;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface FetchOptions {
  url: string;
  method: HttpMethod;
  data?: object | FormData;
  extraHeaders?: Record<string, string>;
}

const requestFetch = async ({
  url,
  method,
  data,
  extraHeaders = {},
}: FetchOptions) => {
  const token = localStorage.getItem('accessToken') || '';

  const baseHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  if (data && !(data instanceof FormData)) {
    baseHeaders['Content-Type'] = 'application/json';
  }

  const headers = new Headers({
    ...baseHeaders,
    ...extraHeaders,
  });

  const fullUrl = `${API_URL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;

  try {
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
};

// POST
export const requestPostFetch = (url: string, data: object | FormData) => {
  return requestFetch({ url, method: 'POST', data });
};

// PUT
export const requestPutFetch = (url: string, data: object | FormData) => {
  return requestFetch({ url, method: 'PUT', data });
};

// GET
export const requestGetFetch = (url: string) => {
  return requestFetch({ url, method: 'GET' });
};

// DELETE
export const requestDeleteFetch = (url: string) => {
  return requestFetch({ url, method: 'DELETE' });
};

// PATCH
export const requestPatchFetch = (url: string, data: object | FormData) => {
  return requestFetch({ url, method: 'PATCH', data });
};
