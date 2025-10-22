/**
 * 카운트를 cap 기준으로 단순 표기합니다.
 * - count >= cap  → `${cap}+`
 * - count <  cap  → 로케일 숫자
 */
export function formatCappedCount(
  count: number,
  {
    cap = 99, // 99 이상이면 "99+"
    locale = 'ko-KR', // 숫자 포맷 로케일
  }: { cap?: number; locale?: string } = {},
): string {
  if (!Number.isFinite(count) || count < 0) return '0';
  if (count >= cap) return `${cap}+`;
  return count.toLocaleString(locale);
}
