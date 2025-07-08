// apps/web/src/types/error.ts
import { AxiosError } from 'axios';

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

/**
 * Axios 에러 타입 가드
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return error instanceof Error && 'isAxiosError' in error;
}

/**
 * 인증 에러 확인 헬퍼 함수
 */
export function isAuthError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  return error.response?.status === 401;
}

/**
 * 서버 에러 확인 헬퍼 함수
 */
export function isServerError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  return (error.response?.status ?? 0) >= 500;
}

/**
 * 네트워크 에러 확인 헬퍼 함수
 */
export function isNetworkError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  return !error.response; // 네트워크 에러는 response가 없음
}

/**
 * 커스텀 API 에러 클래스
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(axiosError: AxiosError) {
    const response = axiosError.response;
    const data = (response?.data ?? {}) as ApiErrorResponse;
    const message = data.message || axiosError.message || 'Unknown error';

    super(message);
    this.name = 'ApiError';
    this.status = response?.status ?? 0;
    this.code = data?.code || 'UNKNOWN_ERROR';
    this.details = data?.details;
  }

  /**
   * 인증 에러인지 확인
   */
  isAuthError(): boolean {
    return this.status === 401;
  }

  /**
   * 권한 에러인지 확인
   */
  isForbiddenError(): boolean {
    return this.status === 403;
  }

  /**
   * 서버 에러인지 확인
   */
  isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * 클라이언트 에러인지 확인
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}
