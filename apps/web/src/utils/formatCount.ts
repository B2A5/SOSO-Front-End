/**
 * 포맷 타입
 * - 'capped': 99+ 형식 (기본값 99)
 * - 'korean': 1.2만, 100만 형식 (한글 약식)
 */
export type FormatType = 'capped' | 'korean';

/**
 * 카운트를 cap 기준으로 단순 표기합니다.
 * - count >= cap  → `${cap}+`
 * - count <  cap  → 로케일 숫자
 *
 * @param count - 표시할 숫자
 * @param options - 옵션
 * @param options.cap - 임계값 (기본: 99)
 * @param options.locale - 로케일 (기본: 'ko-KR')
 * @param options.fallback - count가 invalid일 때 대체값 (기본: '0')
 */
export function formatCappedCount(
  count: number | null | undefined,
  {
    cap = 99,
    locale = 'ko-KR',
    fallback = '0',
  }: { cap?: number; locale?: string; fallback?: string } = {},
): string {
  if (count == null || !Number.isFinite(count) || count < 0)
    return fallback;
  if (count >= cap) return `${cap}+`;
  return count.toLocaleString(locale);
}

/**
 * 숫자를 한글 약식으로 표기합니다. (1.2천, 1.2만, 100만 등)
 *
 * @param count - 표시할 숫자
 * @param options - 옵션
 * @param options.precision - 소수점 자릿수 (기본: 1)
 * @param options.fallback - count가 invalid일 때 대체값 (기본: '0')
 */
export function formatKoreanCount(
  count: number | null | undefined,
  {
    precision = 1,
    fallback = '0',
  }: { precision?: number; fallback?: string } = {},
): string {
  if (count == null || !Number.isFinite(count) || count < 0)
    return fallback;

  const units = [
    { value: 100_000_000, symbol: '억', nextThreshold: Infinity }, // 억
    { value: 10_000, symbol: '만', nextThreshold: 10000 }, // 만 (10000만 = 1억)
    { value: 1_000, symbol: '천', nextThreshold: 10 }, // 천 (10천 = 1만)
  ];

  for (let i = 0; i < units.length; i++) {
    const { value, symbol, nextThreshold } = units[i];

    if (count >= value) {
      const divided = count / value;
      const formatted = divided.toFixed(precision);
      const numericValue = parseFloat(formatted);

      // 반올림 결과가 다음 단위 임계값에 도달하면 다음 단위로 처리
      // 예: 9999 → 10.0천 → 1만, 99999999 → 10000.0만 → 1억
      if (numericValue >= nextThreshold && i > 0) {
        const nextUnit = units[i - 1];
        const nextDivided = count / nextUnit.value;
        const nextFormatted = nextDivided.toFixed(precision);
        const nextCleaned = nextFormatted.replace(/\.0+$/, '');
        const nextParts = nextCleaned.split('.');
        nextParts[0] = parseInt(nextParts[0]).toLocaleString('ko-KR');
        return `${nextParts.join('.')}${nextUnit.symbol}`;
      }

      // 소수점 제거 (1.0만 → 1만)
      const cleaned = formatted.replace(/\.0+$/, '');
      // 천 단위 콤마 추가 (1234.5만 → 1,234.5만)
      const parts = cleaned.split('.');
      parts[0] = parseInt(parts[0]).toLocaleString('ko-KR');
      return `${parts.join('.')}${symbol}`;
    }
  }

  return count.toLocaleString('ko-KR');
}

/**
 * 숫자를 다양한 형식으로 표기하는 통합 함수
 *
 * @param count - 표시할 숫자
 * @param options - 옵션
 * @param options.type - 포맷 타입 (기본: 'capped')
 * @param options.cap - capped 타입일 때 임계값 (기본: 99)
 * @param options.precision - korean 타입일 때 소수점 자릿수 (기본: 1)
 * @param options.locale - capped 타입일 때 로케일 (기본: 'ko-KR')
 * @param options.fallback - count가 invalid일 때 대체값 (기본: '0')
 *
 * @example
 * // Capped 형식 (기본)
 * formatCount(50) // '50'
 * formatCount(100) // '99+'
 * formatCount(100, { cap: 999 }) // '100'
 *
 * // Korean 형식
 * formatCount(1234, { type: 'korean' }) // '1.2천'
 * formatCount(12345, { type: 'korean' }) // '1.2만'
 * formatCount(1234567, { type: 'korean' }) // '123.5만'
 * formatCount(100000000, { type: 'korean' }) // '1억'
 *
 * // 대체값
 * formatCount(null, { fallback: '-' }) // '-'
 * formatCount(undefined, { fallback: 'N/A' }) // 'N/A'
 */
export function formatCount(
  count: number | null | undefined,
  {
    type = 'capped',
    cap = 99,
    precision = 1,
    locale = 'ko-KR',
    fallback = '0',
  }: {
    type?: FormatType;
    cap?: number;
    precision?: number;
    locale?: string;
    fallback?: string;
  } = {},
): string {
  switch (type) {
    case 'korean':
      return formatKoreanCount(count, { precision, fallback });
    case 'capped':
    default:
      return formatCappedCount(count, { cap, locale, fallback });
  }
}
