import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { ApiErrorResponse, ApiError } from '@/api/error';

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // refresh 쿠키 위해
});

// 요청 인터셉터: Access Token 자동 주입
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: ACCESS_TOKEN_EXPIRED 일 때만 refresh → 재시도
apiClient.interceptors.response.use(
  (res) => res,
  async (
    error: AxiosError<ApiErrorResponse> & { config?: RetryConfig },
  ) => {
    const apiErr = ApiError.wrap(error);
    console.error('[API ERROR]', apiErr.code, apiErr.message);

    const original = error.config!;
    const data = error.response?.data;
    if (
      data?.message === 'ACCESS_TOKEN_EXPIRED' &&
      !original._retry
    ) {
      original._retry = true;
      // Refresh Token 쿠키와 함께 호출
      await axios.post(`${BASE_URL}/auth/refresh`, null, {
        withCredentials: true,
      });
      // 기존 요청 재시도
      return apiClient(original);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
