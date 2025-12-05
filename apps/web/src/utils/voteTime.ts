export type VoteDuration = '1d' | '3d' | '7d' | '14d';
/**
 * duration 값(1d, 3d, 7d, 14d)을 숫자로 변환
 */
const getDaysFromDuration = (duration: VoteDuration): number => {
  switch (duration) {
    case '1d':
      return 1;
    case '3d':
      return 3;
    case '7d':
      return 7;
    case '14d':
      return 14;
    default:
      return 3;
  }
};

/**
 * duration 기준으로 마감 시각을 계산해
 * yyyy-MM-ddTHH:mm:ss 형식의 로컬 datetime 문자열로 반환
 */
export const buildEndTimeFromDuration = (
  duration: VoteDuration,
): string => {
  const now = new Date(); // 현재 시각
  const days = getDaysFromDuration(duration); // 며칠 뒤인지 숫자로 변환

  // now + days 만큼 더한 시각
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const yyyy = end.getFullYear();
  const MM = pad(end.getMonth() + 1);
  const dd = pad(end.getDate());
  const HH = pad(end.getHours());
  const mm = pad(end.getMinutes());
  const ss = pad(end.getSeconds());

  return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`;
};
