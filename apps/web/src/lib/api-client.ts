import Axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { refreshToken } from '@/generated/api/endpoints/auth/auth';
import { ApiError } from './api-error';

export const AXIOS_INSTANCE = Axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://soso.dreampaste.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // HttpOnly 쿠키 자동 전송
});

// ============================================
// Response Interceptor (401 자동 갱신)
// ============================================

/**
 * 토큰 갱신 상태 관리
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * 대기 중인 요청들을 처리
 * @param error - 에러가 있으면 모든 요청 실패 처리, 없으면 성공 처리
 */
const processQueue = (error: unknown = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    if (process.env.NODE_ENV === 'development' && error.response) {
      const { status, data } = error.response;
      const url = originalRequest?.url;
      console.error(`[API Error ${status}] ${url}`, data);
    }

    // 401 Unauthorized 에러 처리
    if (
      ApiError.wrap(error).isAuthError() && // 401 에러
      originalRequest && // 원래 요청이 존재
      !originalRequest._retry // 무한 루프 방지
    ) {
      //이미 갱신 중이면 큐에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return AXIOS_INSTANCE(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true; // 무한 루프 방지
      isRefreshing = true;

      try {
        await refreshToken();
        processQueue();
        isRefreshing = false;
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        console.error('[Auth] ❌ 토큰 갱신 실패:', refreshError);
        // 대기 중인 모든 요청 실패 처리
        processQueue(refreshError);
        isRefreshing = false;
        return Promise.reject(refreshError);
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
