// apps/web/src/api/auth.ts
import apiClient from './axios';
import type {
  KakaoLoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  LogoutRequest,
  User,
} from '@/types/auth';

/**
 * 인증 API 클라이언트
 */
class AuthApi {
  /**
   * 카카오 로그인
   */
  async kakaoLogin(request: KakaoLoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/kakao/login', request);
    return response.data;
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(request: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/refresh', request);
    return response.data;
  }

  /**
   * 로그아웃
   */
  async logout(request: LogoutRequest): Promise<void> {
    await apiClient.post('/auth/logout', request);
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
