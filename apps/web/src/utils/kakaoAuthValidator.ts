// utils/kakaoAuthValidator.ts

/**
 * PKCE용 code_verifier와 OAuth state를 세션에 저장합니다.
 */
export function saveKakaoAuthData({
  verifier,
  state,
}: {
  verifier: string;
  state: string;
}): void {
  sessionStorage.setItem('kakao_code_verifier', verifier);
  sessionStorage.setItem('kakao_oauth_state', state);
}

/**
 * 세션에 저장된 OAuth state를 반환합니다.
 */
export function getSavedState(): string | null {
  return sessionStorage.getItem('kakao_oauth_state');
}

/**
 * 세션에 저장된 PKCE code_verifier를 반환합니다.
 */
export function getSavedVerifier(): string | null {
  return sessionStorage.getItem('kakao_code_verifier');
}

/**
 * 콜백 파라미터(stateParam)와 세션 저장 state를 검증하고,
 * 검증 통과 시 verifier를 반환합니다.
 * 검증 실패 시 에러를 던집니다.
 */
export function validateCallbackData({
  stateParam,
}: {
  stateParam?: string;
}): string {
  const savedState = getSavedState();
  if (!savedState || savedState !== stateParam) {
    throw new Error('STATE 검증 실패');
  }

  const verifier = getSavedVerifier();
  if (!verifier) {
    throw new Error('PKCE code_verifier 누락');
  }

  return verifier;
}

/**
 * 세션에 저장된 OAuth 관련 데이터를 모두 제거합니다.
 */
export function clearKakaoAuthData(): void {
  sessionStorage.removeItem('kakao_oauth_state');
  sessionStorage.removeItem('kakao_code_verifier');
}
