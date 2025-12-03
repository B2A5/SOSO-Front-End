/**
 * 카운트 값이 min(기본 0) 아래로 내려가지 않도록 보정합니다.
 */
export const clampCount = (n: number, min = 0) => {
  return Math.max(n, min);
};
