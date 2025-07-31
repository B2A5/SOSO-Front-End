// apps/web/src/api/auth.ts
import apiClient from './axios';
import type {
  KakaoLoginRequest,
  LoginResponse,
  User,
  RefreshResponse,
} from '@/types/auth.types';

/**
 * 카카오 로그인
 */
export async function kakaoLogin(
  request: KakaoLoginRequest,
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/auth/kakao/login',
    request,
  );
  return response.data;
}

/**
 * 토큰 갱신 : ACCESS_TOKEN_EXPIRED 에러 발생 시 호출
 * - 서버에서 Access Token을 갱신하고, 새로운 토큰을 반환합니다
 */

export async function refreshToken(): Promise<RefreshResponse> {
  const response = await apiClient.post<RefreshResponse>(
    '/auth/refresh',
    null, // body 없이 호출
  );
  return response.data;
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout', null);
}

/**
 * 현재 사용자 정보 조회
 * @todo: 아직 API가 구현되지 않았습니다.
 */
export async function getProfile(): Promise<User> {
  const response = await apiClient.get<User>('/auth/profile');
  return response.data;
}

/**
 * 회원 탈퇴
 * @todo: 아직 API가 구현되지 않았습니다.
 */
export async function deleteAccount(): Promise<void> {
  await apiClient.delete('/auth/account');
}

// 싱글톤 인스턴스 export
