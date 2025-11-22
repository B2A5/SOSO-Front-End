import Axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { refreshToken } from '@/generated/api/endpoints/auth/auth';
import { useToast } from '@/hooks/ui/useToast';

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
    const toast = useToast();

    // ============================================
    // 401 Unauthorized: 토큰 만료
    // ============================================
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
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
        // 대기 중인 모든 요청 성공 처리
        processQueue();
        isRefreshing = false;
        // 원래 요청 재시도 (새 쿠키로 자동 전송됨)
        console.log('[Auth] 원래 요청 재시도:', originalRequest.url);
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료되었거나 에러 발생
        console.error('[Auth] ❌ 토큰 갱신 실패:', refreshError);
        // 대기 중인 모든 요청 실패 처리
        processQueue(refreshError);
        isRefreshing = false;
        toast('인증이 만료되었습니다. 다시 로그인해주세요.', 'error');
        return Promise.reject(refreshError);
      }
    }

    // ============================================
    // 기타 에러: 그대로 전달
    // ============================================
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
