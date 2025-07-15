// apps/web/src/utils/query.ts
import { ApiError } from '@/api/error';

/**
 * React Query의 retry 옵션으로 사용할 함수
 * - 인증 오류(401)일 땐 재시도하지 않음
 * - 네트워크/서버 오류일 땐 최대 원하는 만큼 재시도
 * - 그 외 오류는 재시도하지 않음
 *
 * @param failureCount 지금까지 실패한 횟수
 * @param targetCount 재시도할 최대 횟수 (기본값: 3)
 * @param error 발생한 오류 객체
 * @returns 재시도할지 여부
 */
export function retryFn(
  failureCount: number,
  error: ApiError,
  targetCount = 3,
): boolean {
  // 인증 오류면 더 이상 재시도하지 않습니다.
  if (error.isAuthError()) return false;
  // 네트워크나 서버 오류면 최대 원하는 만큼 재시도
  if (error.isNetworkError() || error.isServerError()) {
    return failureCount < targetCount;
  }
  // 그 외 오류는 재시도하지 않음
  return false;
}

/**
 * React Query의 retryDelay 옵션으로 사용할 함수
 * 지수 백오프(exponential backoff)로 재시도 간격을 계산합니다.
 *
 * @param attemptIndex 0부터 시작하는 재시도 횟수
 * @returns 다음 재시도까지 대기할 밀리초
 */
export function retryDelayFn(attemptIndex: number): number {
  // 1초, 2초, 4초, ... 최대 5초
  return Math.min(1000 * 2 ** attemptIndex, 5000);
}
