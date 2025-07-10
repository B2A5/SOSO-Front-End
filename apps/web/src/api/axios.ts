// apps/web/src/api/axios.ts
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '@/types/error';
import { useAuthStore } from '@/stores/authStore';

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── 1) 요청 인터셉터: accessToken 자동 주입 ───────────────────────
apiClient.interceptors.request.use((config) => {
  const { tokens } = useAuthStore.getState();
  if (tokens?.accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// ── 2) 응답 인터셉터: 401 → refresh → 재시도, 그 외는 ApiError ─────
apiClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError & { config?: RetryConfig }) => {
    const original = err.config!;
    const { tokens, login, clearAuth } = useAuthStore.getState();

    // 401 && 리프레시 가능 && 아직 retry 하지 않음
    if (err.response?.status === 401 && !original._retry && tokens?.refreshToken) {
      original._retry = true;
      try {
        // ① 토큰 갱신
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken: tokens.refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        );
        // ② 스토어 업데이트
        login(data.user, data.tokens);
        // ③ 원래 요청 헤더 갱신 후 재시도
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${data.tokens.accessToken}`;
        return apiClient(original);
      } catch {
        // 갱신 실패 → 로그아웃 & 리다이렉트
        clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth?error=session_expired';
        }
        return Promise.reject(err);
      }
    }

    // 나머지 경우는 ApiError로 래핑
    throw new ApiError(err);
  },
);

export default apiClient;
