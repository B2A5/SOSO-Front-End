// apps/web/src/api/kakaoAuth.ts
import apiClient from './axios';
import type { KakaoLoginRequest, LoginResponse } from '@/types/auth';

/**
 * 카카오 인증 URL 생성
 */
export function buildKakaoAuthUrl(params: {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  state: string;
}): string {
  const url = new URL('https://kauth.kakao.com/oauth/authorize');
  url.searchParams.set('client_id', params.clientId);
  url.searchParams.set('redirect_uri', params.redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', params.state);
  url.searchParams.set('code_challenge', params.codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  return url.toString();
}

/**
 * 2) 인가 코드 → 액세스 토큰 교환 요청
 */
export async function requestKakaoToken(request: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
  state?: string;
}): Promise<LoginResponse> {
  const body: KakaoLoginRequest = {
    code: request.code,
    codeVerifier: request.codeVerifier,
    redirectUri: request.redirectUri,
    state: request.state,
  };
  const { data } = await apiClient.post<LoginResponse>('/auth/kakao/login', body);
  return data;
}
