'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/ui/useToast';
import {
  useCastVote,
  useChangeVote,
  useCancelVote,
  getGetPollQueryKey,
} from '@/generated/api/endpoints/poll/poll';
import type { PollDetailResponse } from '@/generated/api/models';
import {
  createOptimisticUpdate,
  type VoteAction,
} from './useVote.reduce';

/**
 * 투표 훅
 *
 * @description
 * 낙관적 업데이트를 통해 투표 기능을 제공합니다.
 * 투표 선택 시 UI를 즉시 업데이트하고, 실패 시 롤백합니다.
 *
 * @param pollId - 투표 게시글 ID
 *
 * @returns
 * - cast: 첫 투표 함수 (POST)
 * - change: 재투표 함수 (PUT)
 * - cancel: 투표 취소 함수 (DELETE)
 * - isPending: 투표 요청 진행 중 여부
 *
 * @remarks
 * **낙관적 업데이트 전략:**
 * - CAST: participantCount +1, 선택 옵션 +1
 * - CHANGE: participantCount 변동 없음, 이전 선택 -1, 새 선택 +1
 * - CANCEL: participantCount -1, 선택 옵션 -1
 *
 * Reducer 패턴을 사용하여 낙관적 업데이트 로직을 순수 함수로 분리했습니다.
 */

// ============================================
// Types
// ============================================

export interface UseVoteReturn {
  cast: (voteOptionIds: number[]) => void;
  change: (voteOptionIds: number[]) => void;
  cancel: () => void;
  isPending: boolean;
}

interface OptimisticContext {
  snapshot: PollDetailResponse | null;
}

// ============================================
// Constants
// ============================================

const VOTE_ERROR_MESSAGES = {
  CAST: '투표 중 오류가 발생했습니다. 다시 시도해주세요.',
  CHANGE: '재투표 중 오류가 발생했습니다. 다시 시도해주세요.',
  CANCEL: '투표 취소 중 오류가 발생했습니다.',
} as const;

// ============================================
// Helper Functions
// ============================================

/**
 * 공통 에러 핸들러 생성 함수
 */
function createErrorHandler(
  queryClient: ReturnType<typeof useQueryClient>,
  voteQueryKey: ReturnType<typeof getGetPollQueryKey>,
  toast: ReturnType<typeof useToast>,
  errorMessage: string,
) {
  return (
    _error: unknown,
    _variables: unknown,
    context: OptimisticContext | undefined,
  ) => {
    if (context?.snapshot) {
      queryClient.setQueryData(voteQueryKey, context.snapshot);
    }
    toast(errorMessage, 'error');
  };
}

/**
 * 공통 낙관적 업데이트 핸들러 생성 함수
 */
function createOptimisticMutateHandler(
  queryClient: ReturnType<typeof useQueryClient>,
  voteQueryKey: ReturnType<typeof getGetPollQueryKey>,
  action: VoteAction,
) {
  return async (): Promise<OptimisticContext> => {
    await queryClient.cancelQueries({ queryKey: voteQueryKey });

    const snapshot =
      queryClient.getQueryData<PollDetailResponse>(voteQueryKey);

    if (!snapshot) return { snapshot: null };

    const optimisticState = createOptimisticUpdate(snapshot, action);
    queryClient.setQueryData<PollDetailResponse>(
      voteQueryKey,
      optimisticState,
    );

    return { snapshot };
  };
}

/**
 * 공통 settled 핸들러
 */
function createSettledHandler(
  queryClient: ReturnType<typeof useQueryClient>,
  voteQueryKey: ReturnType<typeof getGetPollQueryKey>,
) {
  return () => {
    queryClient.invalidateQueries({ queryKey: voteQueryKey });
  };
}

// ============================================
// Main Hook
// ============================================

export function useVote(pollId: number): UseVoteReturn {
  const queryClient = useQueryClient();
  const toast = useToast();

  const voteQueryKey = getGetPollQueryKey(pollId);

  // 공통 settled 핸들러
  const onSettled = createSettledHandler(queryClient, voteQueryKey);

  // CAST: 첫 투표 (POST) - participantCount +1, 선택 옵션 +1
  const castVoteMutation = useCastVote({
    mutation: {
      onMutate: ({ data: { voteOptionIds } }) =>
        createOptimisticMutateHandler(queryClient, voteQueryKey, {
          type: 'CAST',
          nextOptionIds: voteOptionIds,
        })(),
      onError: createErrorHandler(
        queryClient,
        voteQueryKey,
        toast,
        VOTE_ERROR_MESSAGES.CAST,
      ),
      onSettled,
    },
  });

  // CHANGE: 재투표 (PUT) - participantCount 변동 없음, 이전 선택 -1, 새 선택 +1
  const changeVoteMutation = useChangeVote({
    mutation: {
      onMutate: ({ data: { voteOptionIds } }) =>
        createOptimisticMutateHandler(queryClient, voteQueryKey, {
          type: 'CHANGE',
          nextOptionIds: voteOptionIds,
        })(),
      onError: createErrorHandler(
        queryClient,
        voteQueryKey,
        toast,
        VOTE_ERROR_MESSAGES.CHANGE,
      ),
      onSettled,
    },
  });

  // CANCEL: 투표 취소 (DELETE) - participantCount -1, 선택 옵션 -1
  const cancelVoteMutation = useCancelVote({
    mutation: {
      onMutate: () =>
        createOptimisticMutateHandler(queryClient, voteQueryKey, {
          type: 'CANCEL',
        })(),
      onError: createErrorHandler(
        queryClient,
        voteQueryKey,
        toast,
        VOTE_ERROR_MESSAGES.CANCEL,
      ),
      onSettled,
    },
  });

  return {
    cast: (voteOptionIds: number[]) =>
      castVoteMutation.mutate({
        pollId,
        data: { voteOptionIds },
      }),
    change: (voteOptionIds: number[]) =>
      changeVoteMutation.mutate({
        pollId,
        data: { voteOptionIds },
      }),
    cancel: () => cancelVoteMutation.mutate({ pollId }),
    isPending:
      castVoteMutation.isPending ||
      changeVoteMutation.isPending ||
      cancelVoteMutation.isPending,
  };
}
