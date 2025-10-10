'use client';

import { useAuthRestore } from '@/hooks/useAuth';

/**
 * 인증 상태 복원 프로바이더
 *
 * Root Layout에서 사용하여 앱 시작 시 자동으로 인증 상태를 복원합니다.
 * Refresh Token(httpOnly 쿠키)이 있으면 새 Access Token을 발급받아 로그인 상태를 유지합니다.
 *
 * @param children - 하위 컴포넌트
 */
export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthRestore();

  return <>{children}</>;
}
