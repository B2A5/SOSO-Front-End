import { useState, useCallback } from 'react';

/**
 * 🔧 useTap
 * - pressed: 현재 '눌림' 여부
 * - bind:   JSX에 바로 펼칠 수 있는 pointer 이벤트 핸들러
 */
export function useTap() {
  const [pressed, setPressed] = useState(false);

  /* 포인터(터치·마우스) 이벤트 처리 */
  const handleDown = useCallback(() => setPressed(true), []);
  const handleUp = useCallback(() => setPressed(false), []);

  return [
    pressed,
    {
      onPointerDown: handleDown,
      onPointerUp: handleUp,
      onPointerLeave: handleUp,
      onPointerCancel: handleUp,
    } as const,
  ] as const;
}
