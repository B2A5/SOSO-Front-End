// apps/web/src/utils/authUtil.ts
// crypto API를 이용해 code_verifier, code_challenge 생성
// 모바일·SPA처럼 클라이언트 시크릿을 숨길 수 없는 “공용 클라이언트”를 위한 OAuth 2.0 확장 규격
export async function generatePKCE() {
  const iv = window.crypto.getRandomValues(new Uint8Array(32));
  const codeVerifier = btoa(String.fromCharCode(...Array.from(iv)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const digest = await window.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(codeVerifier),
  );
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return { codeVerifier, codeChallenge: base64 };
}

/** CSRF 방지용 랜덤 state 생성 */
//로그인 시퀀스가 다른 사이트에서 조작되는 것을 막기 위해, 클라이언트가 만든 임의의 난수.
export function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
