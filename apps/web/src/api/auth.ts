// apps/web/src/api/auth.ts
import apiClient from './axios';
import type {
  KakaoLoginRequest,
  LoginResponse,
  User,
} from '@/types/auth.types';

/**
 * 인증 API 클라이언트
 */
class AuthApi {
  /**
   * 카카오 로그인
   */
  async kakaoLogin(
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
  async refreshToken(): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/refresh',
      null, // body 없이 호출
    );
    return response.data;
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout', null);
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  }

  /**
   * 회원 탈퇴
   */
  async deleteAccount(): Promise<void> {
    await apiClient.delete('/auth/account');
  }
}

// 싱글톤 인스턴스 export
export const authApi = new AuthApi();
