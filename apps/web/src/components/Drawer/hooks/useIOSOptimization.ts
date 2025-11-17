import { useEffect } from 'react';
import { isIOS } from '../utils';

export interface UseIOSOptimizationProps {
  isOpen: boolean;
  isDragging: boolean;
}

/**
 * iOS Safari 최적화 훅
 *
 * iOS에서 발생하는 문제들을 해결합니다:
 * 1. 스크롤 bounce 제거
 * 2. 동적 주소창 높이 변화 대응
 *
 * @example
 * ```tsx
 * useIOSOptimization({
 *   isOpen,
 *   isDragging,
 * });
 * ```
 */
export function useIOSOptimization({
  isOpen,
  isDragging,
}: UseIOSOptimizationProps) {
  useEffect(() => {
    if (!isIOS() || !isOpen) return;

    // 1. 스크롤 bounce 제거
    const preventBounce = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    document.body.addEventListener('touchmove', preventBounce, {
      passive: false,
    });

    // 2. 주소창 높이 변화 대응 (iOS Safari의 동적 주소창 문제 해결)
    const updateVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', updateVH);
    updateVH(); // 초기 설정

    return () => {
      document.body.removeEventListener('touchmove', preventBounce);
      window.removeEventListener('resize', updateVH);
    };
  }, [isOpen, isDragging]);
}
