import { useState, useEffect } from 'react';

// 지연할 시간 타입 (0 이상의 밀리초)
type Delay = number;

export interface UseLoadingDelayOptions {
  isLoading: boolean;
  /** 로딩 상태가 true로 변경된 후 지연 시간 (ms) */
  delayMs?: Delay | Delay[];
}

export interface UseLoadingDelayReturn {
  /** 지연이 적용된 로딩 상태 */
  isDelayedLoading: boolean;
  /** 현재 지연 단계 (0부터 시작) */
  stage: number;
}

export const useLoadingDelay = ({
  isLoading,
  delayMs = 300,
}: UseLoadingDelayOptions): UseLoadingDelayReturn => {
  const [isDelayedLoading, setIsDelayedLoading] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setIsDelayedLoading(false);
      setStage(0);
      return;
    }

    const delays = Array.isArray(delayMs) ? delayMs : [delayMs];
    const timers = delays.map((delay, index) => {
      return setTimeout(() => {
        if (index === 0) {
          setIsDelayedLoading(true);
        }
        setStage(index + 1);
      }, delay);
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [isLoading, delayMs]);

  return { isDelayedLoading, stage };
};
