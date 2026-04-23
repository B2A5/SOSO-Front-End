import type {
  PollDetailResponse,
  PollOptionResponse,
} from '@/generated/api/models';

// ============================================
// 타입 정의
// ============================================

/**
 * 투표 액션 타입
 *
 * @description
 * 투표 관련 액션을 표현하는 discriminated union 타입입니다.
 *
 * @remarks
 * - CAST: 첫 투표 (participantCount +1, 선택 옵션 +1)
 * - CHANGE: 재투표 (participantCount 변동 없음, 이전 선택 -1, 새 선택 +1)
 * - CANCEL: 투표 취소 (participantCount -1, 선택 옵션 -1)
 */
export type VoteAction =
  | { type: 'CAST'; nextOptionIds: number[] }
  | { type: 'CHANGE'; nextOptionIds: number[] }
  | { type: 'CANCEL' };

// ============================================
// 순수 함수 (Reducer 로직)
// ============================================

/**
 * 투표 옵션들의 득표율을 계산하는 순수 함수
 *
 * @param options - 투표 옵션 배열
 * @param participantCount - 총 투표 수
 * @returns 득표율이 계산된 투표 옵션 배열
 */
export function calculatePercentages(
  options: PollOptionResponse[],
  participantCount: number,
): PollOptionResponse[] {
  return options.map((option) => ({
    ...option,
    percentage:
      participantCount > 0
        ? Math.round((option.voteCount / participantCount) * 100)
        : 0,
  }));
}

/**
 * 투표 액션에 따라 투표 옵션의 카운트를 업데이트하는 순수 함수
 *
 * @param options - 현재 투표 옵션 배열
 * @param action - 투표 액션
 * @param prevSelectedIds - 이전에 선택된 옵션 ID 배열
 * @returns 업데이트된 투표 옵션 배열
 */
export function updateVoteOptionCounts(
  options: PollOptionResponse[],
  action: VoteAction,
  prevSelectedIds: number[],
): PollOptionResponse[] {
  switch (action.type) {
    case 'CAST': //투표
      // 선택된 옵션들 +1
      return options.map((option) => ({
        ...option,
        voteCount: action.nextOptionIds.includes(option.id)
          ? option.voteCount + 1
          : option.voteCount,
      }));

    case 'CHANGE': // 재투표
      // 이전 선택 -1, 새 선택 +1
      return options.map((option) => {
        const wasSelected = prevSelectedIds.includes(option.id);
        const isSelected = action.nextOptionIds.includes(option.id);

        let newCount = option.voteCount;
        if (wasSelected && !isSelected) newCount -= 1;
        if (!wasSelected && isSelected) newCount += 1;

        return { ...option, voteCount: newCount };
      });

    case 'CANCEL': // 투표 취소
      // 이전 선택 -1
      return options.map((option) => ({
        ...option,
        voteCount: prevSelectedIds.includes(option.id)
          ? option.voteCount - 1
          : option.voteCount,
      }));
  }
}

/**
 * 투표 액션에 따라 총 투표 수를 업데이트하는 순수 함수
 *
 * @param currentTotal - 현재 총 투표 수
 * @param action - 투표 액션
 * @returns 업데이트된 총 투표 수
 */
export function updateTotalVotes(
  currentTotal: number,
  action: VoteAction,
): number {
  switch (action.type) {
    case 'CAST':
      return currentTotal + 1; // 새 투표자 +1
    case 'CHANGE':
      return currentTotal; // 재투표는 총 투표수 변동 없음
    case 'CANCEL':
      return currentTotal - 1; // 투표 취소 -1
  }
}

/**
 * 낙관적 업데이트를 수행하는 Reducer 함수
 *
 * @description
 * 순수 함수로 구현되어 테스트가 용이합니다.
 * 투표 액션에 따라 새로운 상태를 반환합니다.
 *
 * @param snapshot - 현재 투표 게시글 상태
 * @param action - 투표 액션
 * @returns 업데이트된 투표 게시글 상태
 *
 * @example
 * ```typescript
 * const newState = createOptimisticUpdate(currentState, {
 *   type: 'CAST',
 *   nextOptionIds: [1, 2]
 * });
 * ```
 */
export function createOptimisticUpdate(
  snapshot: PollDetailResponse,
  action: VoteAction,
): PollDetailResponse {
  const prevSelectedIds = snapshot.voteInfo.myOptionIds;

  // 1. 투표 옵션 카운트 업데이트
  const updatedOptions = updateVoteOptionCounts(
    snapshot.options,
    action,
    prevSelectedIds,
  );

  // 2. 총 투표 수 업데이트
  const updatedParticipantCount = updateTotalVotes(
    snapshot.voteInfo.participantCount,
    action,
  );

  // 3. 퍼센티지 재계산
  const optionsWithPercentage = calculatePercentages(
    updatedOptions,
    updatedParticipantCount,
  );

  // 4. 새로운 선택된 옵션 ID 결정
  const nextSelectedIds =
    action.type === 'CANCEL' ? [] : action.nextOptionIds;

  // 5. hasVoted 상태 결정
  const hasVoted = action.type !== 'CANCEL';

  return {
    ...snapshot,
    hasVoted,
    voteInfo: {
      ...snapshot.voteInfo,
      myOptionIds: nextSelectedIds,
      participantCount: updatedParticipantCount,
    },
    options: optionsWithPercentage,
  };
}
