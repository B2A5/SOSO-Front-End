// apps/web/src/hooks/useToast.ts
import {
  useToastStore,
  ToastMessage,
  ToastType,
} from '@/stores/toastStore';
import { useCallback } from 'react';

let nextId = 1;

/**
 * 전역 toast 추가 훅
 */
export const useToast = () => {
  const add = useToastStore((s) => s.addToast);

  return useCallback(
    (message: string, type: ToastType = 'info') => {
      const toast: ToastMessage = {
        id: nextId++,
        message,
        type,
      };
      add(toast);
      // 여기서는 제거 타이머를 두지 않습니다.
      // Toast 컴포넌트가 스스로 사라지고 onRemove 콜백을 호출해요.
    },
    [add],
  );
};
