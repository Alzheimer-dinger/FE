import axios from 'axios';

// API 기본 설정
const API_BASE_URL = 'http://localhost:8080';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// 로그아웃 API
export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post('/api/users/logout');
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error);
    // API 호출이 실패해도 로컬에서 로그아웃 처리
  } finally {
    // 로컬 스토리지 정리
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // 기타 필요한 데이터 정리
  }
};

// 피드백 등록 API
export const submitFeedback = async (rating: string, reason: string): Promise<void> => {
  const response = await apiClient.post('/api/feedback', {
    rating,
    reason,
  });
  return response.data;
};

// 프로필 이미지 업로드 URL 요청 API
export const getProfileImageUploadUrl = async (): Promise<{ uploadUrl: string }> => {
  const response = await apiClient.get('/api/images/profile/upload-url');
  return response.data;
};

// 프로필 이미지 업데이트 API
export const updateProfileImage = async (fileKey: string): Promise<void> => {
  await apiClient.post('/api/images/profile', {
    fileKey,
  });
};

// 리마인더 조회 API
export const getReminder = async (): Promise<{ time: string } | null> => {
  try {
    const response = await apiClient.get('/api/reminder');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // 리마인더가 설정되지 않은 경우
      return null;
    }
    throw error;
  }
};

// 리마인더 설정 API
export const setReminder = async (time: string): Promise<void> => {
  await apiClient.post('/api/reminder', {
    fireTime: time,
    status: time ? 'ACTIVE' : 'INACTIVE',
  });
};

export default apiClient;
