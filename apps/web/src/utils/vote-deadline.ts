import {
  format,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';

/**
 * 투표 마감 시간을 사용자 친화적인 형식으로 변환
 *
 * 규칙:
 * - 7일 초과: "25.12.25 마감" (날짜 표시)
 * - 7일 이내: "7일 후 마감", "6일 후 마감"
 * - 하루 이내: "12시간 후 마감", "20시간 후 마감"
 * - 1시간 이내: "30분 후 마감", "45분 후 마감"
 * - 마감된 경우: "마감됨"
 *
 * @param endTime - ISO 형식의 마감 시간 문자열
 * @returns 포맷된 마감 시간 문자열
 */
export function formatVoteDeadline(endTime: string): string {
  const now = new Date();
  const endDate = new Date(endTime);

  // 이미 마감된 경우
  if (endDate <= now) {
    return '마감됨';
  }

  const daysLeft = differenceInDays(endDate, now);
  const hoursLeft = differenceInHours(endDate, now);
  const minutesLeft = differenceInMinutes(endDate, now);

  // 7일 초과: 날짜 표시 (YY.MM.DD 형식)
  if (daysLeft > 7) {
    return `${format(endDate, 'yy.MM.dd')} 마감`;
  }

  // 7일 이내: 일 단위 표시
  if (daysLeft >= 1) {
    return `${daysLeft}일 후 마감`;
  }

  // 하루 이내: 시간 단위 표시
  if (hoursLeft >= 1) {
    return `${hoursLeft}시간 후 마감`;
  }

  // 1시간 이내: 분 단위 표시
  return `${minutesLeft}분 후 마감`;
}
