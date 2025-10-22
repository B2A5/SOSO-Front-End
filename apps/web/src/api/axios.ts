import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { ApiErrorResponse, ApiError } from '@/api/error';

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://35.216.2.203:8080';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // refresh 쿠키 위해
});

// ============================================
// Token Refresh 관리
// ============================================

/**
 * 토큰 갱신 중복 방지를 위한 Promise 캐시
 * 여러 API가 동시에 401을 받아도 refresh는 한 번만 실행
 */
let refreshTokenPromise: Promise<string> | null = null;

/**
 * Access Token 갱신 함수
 * - 동시 요청 시 중복 refresh 방지
 * - 갱신 실패 시 자동 로그아웃
 */
async function refreshAccessToken(): Promise<string> {
  // 이미 갱신 중이면 기존 Promise 재사용
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      console.log('[Token Refresh] Refreshing access token...');

      // Refresh Token으로 새 Access Token 발급
      const response = await axios.post(
        `${BASE_URL}/auth/refresh`,
        null,
        {
          withCredentials: true, // HTTP-only 쿠키의 refresh token 전송
        },
      );

      const newAccessToken = response.data.jwtAccessToken;

      if (!newAccessToken) {
        throw new Error('New access token not received');
      }

      // 새 토큰 저장
      useAuthStore.getState().setToken(newAccessToken);
      console.log('[Token Refresh] Success');

      return newAccessToken;
    } catch (error) {
      console.error('[Token Refresh] Failed:', error);

      // Refresh 실패 시 로그아웃 처리
      useAuthStore.getState().logout();

      // 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      throw error;
    } finally {
      // 갱신 완료 후 Promise 캐시 초기화
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
}

// ============================================
// 요청 인터셉터: Access Token 자동 주입
// ============================================

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// 응답 인터셉터: 토큰 만료 시 자동 갱신 및 재시도
// ============================================

apiClient.interceptors.response.use(
  (res) => res,
  async (
    error: AxiosError<ApiErrorResponse> & { config?: RetryConfig },
  ) => {
    // API 오류 로깅
    const apiErr = ApiError.wrap(error);
    console.error('[API ERROR]', apiErr.code, apiErr.message);

    const originalRequest = error.config;
    const errorData = error.response?.data;

    // 원본 요청이 없거나 이미 재시도했으면 에러 반환
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Access Token 만료 시 갱신 및 재시도
    if (
      errorData?.message === 'ACCESS_TOKEN_EXPIRED' ||
      (error.response?.status === 401 &&
        apiErr.code === 'ACCESS_TOKEN_EXPIRED')
    ) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 (동시 요청 시 자동으로 하나로 병합됨)
        const newAccessToken = await refreshAccessToken();

        // 원본 요청에 새 토큰 적용
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // 원본 요청 재시도
        console.log('[API Retry] Retrying with new token');
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh 실패 시 에러 반환 (이미 로그아웃 처리됨)
        console.error('[API Retry] Failed to refresh token');
        return Promise.reject(refreshError);
      }
    }

    // 그 외 에러는 그대로 반환
    return Promise.reject(error);
  },
);

export default apiClient;
