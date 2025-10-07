// rAF 기반 쓰로틀: 같은 프레임에서 여러 번 호출돼도 마지막 인자만 사용해 한 번만 실행
export type RafThrottled<A extends readonly unknown[]> = ((
  ...args: A
) => void) & {
  cancel: () => void; // 예약 취소
  flush: () => void; // 예약된 실행 즉시 수행
};

export function rafThrottle<A extends readonly unknown[]>(
  fn: (...args: A) => void,
): RafThrottled<A> {
  let rafId = 0; // requestAnimationFrame 예약 ID (0이면 없음)
  let queued = false; // 현재 프레임에 실행 예약 여부
  let lastArgs: A | null = null; // 마지막으로 받은 인자 저장

  function run(): void {
    rafId = 0;
    queued = false;
    if (lastArgs) {
      fn(...lastArgs); // 마지막 인자로 1회 실행
      lastArgs = null;
    }
  }

  const throttled = ((...args: A) => {
    lastArgs = args; // 최신 인자만 유지
    if (queued) return; // 이미 예약되어 있으면 무시
    queued = true;
    rafId = requestAnimationFrame(run); // 다음 리페인트 직전에 실행
  }) as RafThrottled<A>;

  throttled.cancel = (): void => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    queued = false;
    lastArgs = null;
  };

  throttled.flush = (): void => {
    if (!queued) return;
    if (rafId) cancelAnimationFrame(rafId);
    run();
  };

  return throttled;
}
