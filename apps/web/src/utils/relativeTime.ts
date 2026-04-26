/**
 * createdAt ISO 문자열을 받아,
 * 현재 시간과의 차이를 한글 상대 시간으로 반환하는 유틸 함수
 */
export function relativeTime(createdAt: string): string {
  const past = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - past.getTime();

  // 밀리초 → 초, 분, 시간, 일 단위로 변환
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // 1분 미만: 방금 전
  if (diffSeconds < 60) {
    return '방금 전';
  }
  // 1시간 미만: n분 전
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }
  // 1일 미만: n시간 전
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }
  // 1주 미만: n일 전
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }
  // 1달 미만: n주 전
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}주 전`;
  }
  // 1년 미만: n달 전
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}달 전`;
  }
  // 그 외: n년 전
  const years = Math.floor(diffDays / 365);
  return `${years}년 전`;
}

/**
 * createdAt과 updatedAt을 비교하여 수정 여부에 따른 시간 표시를 반환하는 유틸 함수
 *
 */
export function formatTimeAgo(
  createdAt: string,
  updatedAt: string,
): string {
  const created = new Date(createdAt);
  const updated = new Date(updatedAt);

  // updatedAt이 createdAt보다 크면 수정된 것으로 간주
  const isEdited = updated.getTime() > created.getTime();

  if (isEdited) {
    // 수정된 경우: updatedAt 기준으로 상대 시간 계산
    const timeText = relativeTime(updatedAt);
    return `${timeText} 수정됨`;
  }

  // 수정되지 않은 경우: createdAt 기준으로 상대 시간 반환
  return relativeTime(createdAt);
}
