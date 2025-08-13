import axios from 'axios';

// API 기본 설정
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;
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
    const token = localStorage.getItem('accessToken');
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
      const url: string = error.config?.url ?? '';
      const method: string = (error.config?.method || '').toLowerCase();
      // 프로필 수정(비밀번호 검증 실패 등)에서는 리다이렉트하지 않음
      if (url.includes('/api/users/profile') && method === 'patch') {
        return Promise.reject(error);
      }
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem('accessToken');
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
    localStorage.removeItem('accessToken');
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

// 프로필 이미지 업로드 URL 요청 API (extension 쿼리 필요)
export const getProfileImageUploadUrl = async (extension: string): Promise<{ uploadUrl: string }> => {
  const response = await apiClient.get('/api/images/profile/upload-url', {
    params: { extension },
  });
  return response.data;
};

// 프로필 이미지 업데이트 API (업데이트된 프로필 반환)
export const updateProfileImage = async (fileKey: string): Promise<UserProfile> => {
  const response = await apiClient.post('/api/images/profile', {
    fileKey,
  });
  const payload = response.data;
  return (payload && payload.result) ? payload.result : payload;
};

// 리마인더 조회 API
export interface ReminderResponse {
  fireTime?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  time?: string; // 하위 호환
}

export const getReminder = async (): Promise<ReminderResponse | null> => {
  try {
    const response = await apiClient.get('/api/reminder');
    const payload = response.data;
    return (payload && (payload as any).result) ? (payload as any).result : payload;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // 리마인더가 설정되지 않은 경우
      return null;
    }
    throw error;
  }
};

// 리마인더 설정 API
export const setReminder = async (time: string | null): Promise<void> => {
  const body = time
    ? { fireTime: time, status: 'ACTIVE' }
    : { status: 'INACTIVE' };
  await apiClient.post('/api/reminder', body);
};

// 관계 관련 타입 정의
export interface Relation {
  counterId: string;
  name: string;
  patientCode: string;
  relationType: 'GUARDIAN' | 'PATIENT';
  createdAt: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  initiator: 'GUARDIAN' | 'PATIENT';
}

// 관계 요청 응답을 위한 타입 (relationId 포함)
export interface RelationResponse {
  relationId: string;
  counterId: string;
  name: string;
  patientCode: string;
  relationType: 'GUARDIAN' | 'PATIENT';
  createdAt: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  initiator: 'GUARDIAN' | 'PATIENT';
}

export interface RelationRequest {
  to: string;
}

export interface RelationResendRequest {
  relationId: string;
  to: string;
}

// 관계 목록 조회 API
export const getRelations = async (): Promise<Relation[]> => {
  const response = await apiClient.get('/api/relations');
  const payload = response.data as any;
  const list = payload && payload.result ? payload.result : payload;
  return Array.isArray(list) ? list : [];
};

// 관계 요청 전송 API
export const sendRelationRequest = async (to: string): Promise<any> => {
  const response = await apiClient.post('/api/relations/send', { to });
  return response.data;
};

// 관계 요청 응답 API (승인/거절)
export const replyToRelationRequest = async (counterId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<void> => {
  await apiClient.patch('/api/relations/reply', {
    relationId: counterId, // counterId를 relationId로 사용
    status,
  });
};

// 관계 요청 재전송 API
export const resendRelationRequest = async (relationId: string, to: string): Promise<any> => {
  const response = await apiClient.post('/api/relations/resend', {
    relationId,
    to,
  });
  return response.data;
};

// 관계 해제 API
export const deleteRelation = async (counterId: string): Promise<void> => {
  await apiClient.delete(`/api/relations/${counterId}`); // counterId를 relationId로 사용
};

// 프로필 관련 타입 정의
export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  gender: 'MALE' | 'FEMALE';
  imageUrl: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  gender?: 'MALE' | 'FEMALE';
  currentPassword?: string;
  newPassword?: string;
  passwordChangeValid?: boolean;
}

// 프로필 조회 API
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/api/users/profile');
  // API가 { timestamp, code, message, result } 랩퍼를 사용하는 경우 대응
  const payload = response.data;
  return (payload && payload.result) ? payload.result : payload;
};

// 프로필 수정 API
export const updateUserProfile = async (profileData: ProfileUpdateRequest): Promise<UserProfile> => {
  const response = await apiClient.patch('/api/users/profile', profileData);
  const payload = response.data;
  return (payload && payload.result) ? payload.result : payload;
};

export default apiClient;
