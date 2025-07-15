import { AxiosError } from 'axios';

/**
 * 서버에서 내려오는 에러 응답 스펙
 */
export interface ApiErrorResponse {
  code: string; // 내부 에러 코드
  message: string; // 서버가 전달하는 메시지
  status: number; // HTTP 상태 코드
  details?: Record<string, unknown>;
}

/** AxiosError 타입 가드 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    error instanceof Error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * API 호출 중 발생한 에러를 래핑하고,
 * 분류 · 메시지 매핑 · 재시도 판단까지 담당하는 클래스
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(axiosError: AxiosError) {
    const response = axiosError.response;
    const data = (response?.data ?? {}) as ApiErrorResponse;
    const msg =
      data.message || axiosError.message || 'Unknown API error';
    super(msg);

    this.name = 'ApiError';
    this.status = response?.status ?? 0;
    this.code = data.code || 'UNKNOWN_ERROR';
    this.details = data.details;
  }

  /** HTTP 401 */
  public isAuthError(): boolean {
    return this.status === 401;
  }

  /** HTTP 403 */
  public isForbiddenError(): boolean {
    return this.status === 403;
  }

  /** 400 ≤ status < 500 */
  public isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /** status ≥ 500 */
  public isServerError(): boolean {
    return this.status >= 500;
  }

  /** 네트워크 오류: response가 없으면 true */
  public isNetworkError(): boolean {
    return !this.status; // status가 0이면 네트워크 오류
  }

  /** 사용자에게 보여줄 메시지 */
  public toUserMessage(): string {
    if (this.isAuthError()) return '인증에 실패했습니다.';
    if (this.isForbiddenError()) return '권한이 없습니다.';
    if (this.isClientError()) return '잘못된 요청입니다.';
    if (this.isServerError()) return '서버에 문제가 발생했습니다.';
    if (this.isNetworkError()) return '네트워크 연결을 확인해주세요.';
    return '알 수 없는 API 오류가 발생했습니다.';
  }

  /**
   * unknown 타입의 에러를 ApiError로 래핑
   * - 이미 ApiError면 그대로
   * - AxiosError면 new ApiError()
   * - 그 외 Error면 throw
   */
  public static wrap(error: unknown): ApiError {
    if (error instanceof ApiError) return error;
    if (isAxiosError(error)) return new ApiError(error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  /** 편의: 래핑 + 메시지 추출 */
  public static getErrorMessage(error: unknown): string {
    try {
      return ApiError.wrap(error).toUserMessage();
    } catch {
      return '예기치 못한 오류가 발생했습니다.';
    }
  }
}
