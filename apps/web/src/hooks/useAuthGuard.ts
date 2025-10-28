// apps/web/src/hooks/useAuthGuard.ts
'use client';

import { useAuthStore } from '@/stores/authStore';

type Options = {
  onUnauthed?: () => void; // 미로그인일 때 할 행동(예: 로그인 모달 열기)
};

export function useAuthGuard(options: Options = {}) {
  const authed = useAuthStore((s) => !!s.accessToken);

  /** 인증됐을 때만 fn 실행. 아니면 onUnauthed 호출하고 끝. */
  const guard = (fn: () => void | Promise<void>) => {
    if (!authed) {
      options.onUnauthed?.();
      return;
    }
    return fn();
  };

  /** 인증 여부만 필요할 때: true/false 반환 */
  const ensureAuthed = () => {
    if (!authed) {
      options.onUnauthed?.();
      return false;
    }
    return true;
  };

  return { authed, guard, ensureAuthed };
}
