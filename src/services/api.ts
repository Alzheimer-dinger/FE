import axios from 'axios';

// API 기본 설정
const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}`;
// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - 토큰 만료 처리
apiClient.interceptors.response.use(
  response => response,
  error => {
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
  },
);

// 로그아웃 API
export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.delete('/api/users/logout');
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  }
};

// 피드백 등록 API
export const submitFeedback = async (
  rating: string,
  reason: string,
): Promise<void> => {
  const response = await apiClient.post('/api/feedback', {
    rating,
    reason,
  });
  return response.data;
};

// 프로필 이미지 업로드 URL 요청 API (extension 쿼리 필요)
export interface ProfileUploadUrlResponse {
  uploadUrl: string;
  fileKey?: string;
  key?: string;
  id?: string;
}

export const getProfileImageUploadUrl = async (
  extension: string,
): Promise<ProfileUploadUrlResponse> => {
  console.log('[ProfileUpload][GET] requesting presigned URL', {
    baseURL: API_BASE_URL,
    extension,
  });
  const response = await apiClient.get('/api/images/profile/upload-url', {
    params: { extension },
  });
  const payload = response.data as any;
  const data = payload && payload.result ? payload.result : payload;
  console.log('[ProfileUpload][GET] presigned URL response', data);
  return data as ProfileUploadUrlResponse;
};

// 프로필 이미지 업데이트 API (업데이트된 프로필 반환)
export const updateProfileImage = async (
  fileKey: string,
): Promise<UserProfile> => {
  const response = await apiClient.post('/api/images/profile', {
    fileKey,
  });
  const payload = response.data;
  return payload && payload.result ? payload.result : payload;
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
    return payload && (payload as any).result
      ? (payload as any).result
      : payload;
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

// 일간 감정 분석 타입 및 API
export interface MonthlyEmotionDataItem {
  date: string; // YYYY-MM-DD
  emotionType: string; // e.g., HAPPY, SAD, ANGRY, SURPRISED, BORED
}

export interface DayAnalysis {
  userId: string;
  analysisDate: string; // YYYY-MM-DD
  hasData: boolean;
  happyScore: number;
  sadScore: number;
  angryScore: number;
  surprisedScore: number;
  boredScore: number;
}

// 월간 감정 데이터 응답 타입
export interface MonthlyEmotionResponse {
  userId: string;
  month: string; // YYYY-MM-DD
  monthlyEmotionData: MonthlyEmotionDataItem[];
}

export const getDayAnalysis = async (
  date: string,
  userId: string,
): Promise<DayAnalysis | null> => {
  try {
    const response = await apiClient.get('/api/analysis/day', {
      params: { date, userId },
    });
    const payload = response.data as any;
    return payload && payload.result
      ? (payload.result as DayAnalysis)
      : (payload as DayAnalysis);
  } catch (error: any) {
    if (error?.response?.status === 400) {
      return null; // 잘못된 날짜 형식
    }
    throw error; // 그 외 에러는 상위에서 처리
  }
};

// 월간 감정 데이터 조회 API
export const getMonthlyEmotionData = async (
  month: string,
  userId: string,
): Promise<MonthlyEmotionResponse | null> => {
  console.log('📅 [월간 감정] API 호출 시작', {
    url: '/api/analysis/emotion/monthly',
    method: 'GET',
    params: { month, userId },
    baseURL: apiClient.defaults.baseURL,
  });

  try {
    const response = await apiClient.get('/api/analysis/emotion/monthly', {
      params: { month, userId },
    });

    console.log('📅 [월간 감정] API 응답 성공', {
      status: response.status,
      statusText: response.statusText,
      dataKeys: Object.keys(response.data || {}),
      responseData: response.data,
    });

    const payload = response.data as any;
    const result =
      payload && payload.result
        ? (payload.result as MonthlyEmotionResponse)
        : (payload as MonthlyEmotionResponse);

    console.log('📅 [월간 감정] 최종 파싱 결과', result);
    return result;
  } catch (error: any) {
    console.error('❌ [월간 감정] API 오류', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      responseData: error?.response?.data,
      message: error?.message,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
        params: error?.config?.params,
      },
    });

    if (error?.response?.status === 400) {
      return null; // 잘못된 날짜 형식
    }
    throw error;
  }
};

// 기간 감정 분석 타입 및 API
export interface PeriodTimelineItem {
  date: string;
  happyScore: number;
  sadScore: number;
  angryScore: number;
  surprisedScore: number;
  boredScore: number;
  riskScore: number;
}

export interface PeriodAnalysis {
  userId: string;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  averageRiskScore: number;
  emotionTimeline: PeriodTimelineItem[];
  totalParticipate: number;
  averageCallTime: string;
}

export const getPeriodAnalysis = async (
  start: string,
  end: string,
  userId: string,
): Promise<PeriodAnalysis | null> => {
  try {
    const response = await apiClient.get('/api/analysis/period', {
      params: { start, end, userId },
    });
    const payload = response.data as any;
    return payload && payload.result
      ? (payload.result as PeriodAnalysis)
      : (payload as PeriodAnalysis);
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// 종합보고서 관련 타입 정의
export interface LatestReport {
  reportId: string;
  userId: string;
  createdAt: string;
  report: string;
}

// 최근 분석 리포트 조회 API
export const getLatestReport = async (
  periodEnd: string,
  userId: string,
): Promise<LatestReport | null> => {
  try {
    const response = await apiClient.get('/api/analysis/report/latest', {
      params: { periodEnd, userId },
    });
    const payload = response.data as any;
    return payload && payload.result
      ? (payload.result as LatestReport)
      : (payload as LatestReport);
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// 관계 관련 타입 정의
export interface Relation {
  relationId: string;
  name: string;
  patientCode: string;
  userId: string;
  relationType: 'GUARDIAN' | 'PATIENT';
  createdAt: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'DISCONNECTED';
  isInitiator: boolean;
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
  console.log('[Relation][LIST][REQUEST][service] /api/relations');
  const response = await apiClient.get('/api/relations');
  const payload = response.data as any;
  const list = payload && payload.result ? payload.result : payload;
  console.log('[Relation][LIST][RESPONSE][service] /api/relations', {
    count: Array.isArray(list) ? list.length : 0,
    sample: Array.isArray(list) ? list.slice(0, 3) : list,
  });
  return Array.isArray(list) ? list : [];
};

// 관계 요청 전송 API
export interface ApiEnvelope<T> {
  timestamp?: string;
  code?: string;
  message?: string;
  result?: T;
}

export const sendRelationRequest = async (
  patientCode: string,
): Promise<ApiEnvelope<string>> => {
  console.log('🔗 [관계 추가] API 호출 시작', {
    url: '/api/relations/send',
    method: 'POST',
    body: { patientCode },
    baseURL: apiClient.defaults.baseURL,
    timestamp: new Date().toISOString(),
  });

  try {
    const response = await apiClient.post('/api/relations/send', {
      patientCode,
    });

    console.log('🔗 [관계 추가] API 응답 성공', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      responseData: response.data,
    });

    const raw = response.data as any;
    const envelope: ApiEnvelope<string> =
      raw && typeof raw === 'object' && ('result' in raw || 'message' in raw)
        ? (raw as ApiEnvelope<string>)
        : { result: raw };

    console.log('🔗 [관계 추가] 최종 파싱 결과', envelope);
    return envelope;
  } catch (error: any) {
    console.error('❌ [관계 추가] API 오류', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      responseData: error?.response?.data,
      message: error?.message,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
        data: error?.config?.data,
      },
    });
    throw error;
  }
};

// 관계 요청 응답 API (승인/거절)
export const replyToRelationRequest = async (
  counterId: string,
  status: 'ACCEPTED' | 'REJECTED',
): Promise<void> => {
  console.log('[Relation][REPLY][REQUEST] /api/relations/reply', {
    relationId: counterId,
    status,
  });
  await apiClient.patch('/api/relations/reply', undefined, {
    params: {
      relationId: counterId, // counterId를 relationId로 사용
      status,
    },
  });
  console.log('[Relation][REPLY][RESPONSE] /api/relations/reply OK');
};

// 관계 요청 재전송 API
export const resendRelationRequest = async (
  relationId: string,
): Promise<any> => {
  const token = localStorage.getItem('accessToken');
  console.log('[Relation][RESEND][REQUEST][service] /api/relations/resend', {
    relationId,
    hasToken: Boolean(token),
    tokenPreview: token ? token.slice(0, 12) + '...' : undefined,
  });
  try {
    const response = await apiClient.post('/api/relations/resend', {
      relationId,
    });
    console.log(
      '[Relation][RESEND][RESPONSE][service] /api/relations/resend',
      response.data,
    );
    return response.data;
  } catch (err: any) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    console.warn('[Relation][RESEND][ERROR][service]', { status, data });
    throw err;
  }
};

// 관계 해제 API
export const deleteRelation = async (relationId: string): Promise<void> => {
  console.log('[Relation][DELETE][REQUEST] /api/relations', { relationId });
  await apiClient.delete('/api/relations', {
    params: { relationId },
  });
  console.log('[Relation][DELETE][RESPONSE] /api/relations OK');
};

// 프로필 관련 타입 정의
export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  gender: 'MALE' | 'FEMALE';
  imageUrl: string;
  patientCode?: string;
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
  return payload && payload.result ? payload.result : payload;
};

// 프로필 수정 API
export const updateUserProfile = async (
  profileData: ProfileUpdateRequest,
): Promise<UserProfile> => {
  const response = await apiClient.patch('/api/users/profile', profileData);
  const payload = response.data;
  return payload && payload.result ? payload.result : payload;
};

export default apiClient;
