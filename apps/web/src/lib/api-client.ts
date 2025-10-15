import Axios, { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';

export const AXIOS_INSTANCE = Axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://soso.dreampaste.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Refresh Token 쿠키 전송
});

// 요청 시 Access Token 자동 헤더 설정
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    // authStore에서 Access Token 읽기 (SSR 안전)
    if (typeof window !== 'undefined') {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 에러 핸들링 인터셉터
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    // 개발 모드에서 에러 로깅
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      const status = error.response?.status;
      const data = error.response?.data;
      const url = error.config?.url;

      console.error(`[API Error ${status}] ${url}`, data);
    }

    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      // Access Token 만료 - 자동으로 refresh 시도는 axios.ts에서 처리
      if (typeof window !== 'undefined') {
        console.log('[API] 401 Unauthorized - 토큰 만료');
      }
    }
    return Promise.reject(error);
  },
);

// Custom instance for orval
export const customInstance = <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error cancel is a custom property
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customInstance;
