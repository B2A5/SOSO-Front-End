import { generatePKCE, generateState } from '@/utils/pkce';
import * as storage from './storage';

/**
 * 카카오 인증 에러
 */
export class KakaoAuthError extends Error {
  constructor(
    message: string,
    public code:
      | 'STATE_MISMATCH'
      | 'VERIFIER_MISSING'
      | 'PKCE_FAILED'
      | 'ENV_MISSING',
  ) {
    super(message);
    this.name = 'KakaoAuthError';
  }
}

/**
 * 카카오 인증 URL 생성
 */
function buildAuthUrl(params: {
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
 * 카카오 로그인 준비
 * - PKCE 생성
 * - state 생성
 * - storage 저장
 * - 인증 URL 반환
 */
export async function prepareLogin(params: {
  clientId: string;
  redirectUri: string;
}): Promise<string> {
  try {
    // PKCE & state 생성
    const { codeVerifier, codeChallenge } = await generatePKCE();
    const state = generateState();

    // storage 저장
    storage.setVerifier(codeVerifier);
    storage.setState(state);

    // URL 생성
    return buildAuthUrl({
      clientId: params.clientId,
      redirectUri: params.redirectUri,
      codeChallenge,
      state,
    });
  } catch (error) {
    console.error('PKCE 생성 실패:', error);
    throw new KakaoAuthError(
      'PKCE 생성에 실패했습니다',
      'PKCE_FAILED',
    );
  }
}

/**
 * 콜백 검증 및 로그인 데이터 준비
 * - state 검증 (CSRF 방지)
 * - verifier 확인
 * - 로그인 요청 데이터 반환
 */
export function validateCallback(params: {
  code: string;
  state: string | null;
  redirectUri: string;
}): {
  code: string;
  codeVerifier: string;
  redirectUri: string;
  state: string;
} {
  // state 검증
  const savedState = storage.getState();
  if (!savedState || savedState !== params.state) {
    throw new KakaoAuthError(
      'STATE가 일치하지 않습니다. CSRF 공격 가능성이 있습니다.',
      'STATE_MISMATCH',
    );
  }

  // verifier 확인
  const codeVerifier = storage.getVerifier();
  if (!codeVerifier) {
    throw new KakaoAuthError(
      'PKCE code_verifier를 찾을 수 없습니다.',
      'VERIFIER_MISSING',
    );
  }

  return {
    code: params.code,
    codeVerifier,
    redirectUri: params.redirectUri,
    state: savedState,
  };
}

/**
 * 인증 데이터 정리
 * - 로그인 완료 또는 실패 시 호출
 */
export function cleanup(): void {
  storage.clear();
}
