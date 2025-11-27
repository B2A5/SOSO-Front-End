import Axios, { AxiosError } from 'axios';

export class ApiError extends Error {
  status?: number;
  data?: unknown;
  url?: string;

  constructor(
    message: string,
    status?: number,
    data?: unknown,
    url?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.url = url;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromAxios(error: AxiosError) {
    return new ApiError(
      error.message || '요청 처리 중 오류가 발생했습니다.',
      error.response?.status,
      error.response?.data,
      error.config?.url,
    );
  }

  static wrap(error: unknown): ApiError {
    if (error instanceof ApiError) return error;
    if (Axios.isAxiosError(error)) return ApiError.fromAxios(error);
    if (error instanceof Error) return new ApiError(error.message);
    return new ApiError('알 수 없는 오류가 발생했습니다.');
  }

  isAuthError() {
    return this.status === 401;
  }

  isServerError() {
    return (this.status ?? 0) >= 500;
  }

  isNetworkError() {
    return this.status === undefined;
  }
}
