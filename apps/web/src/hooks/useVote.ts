'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/ui/useToast';
import {
  useCastVote,
  getGetVotePostQueryKey,
} from '@/generated/api/endpoints/voteboard/voteboard';
import type { VoteboardDetailResponse } from '@/generated/api/models';

/**
 * 투표 커스텀 훅
 *
 * @description
 * 낙관적 업데이트를 통해 투표 기능을 제공합니다.
 * 투표 선택 시 UI를 즉시 업데이트하고, 실패 시 롤백합니다.
 *
 * @param votesboardId - 투표 게시글 ID
 *
 * @returns
 * - castVote: 투표 실행 함수
 * - isPending: 투표 요청 진행 중 여부
 *
 * @remarks
 * **낙관적 업데이트 전략:**
 * 1. onMutate: 즉시 UI 업데이트 (hasVoted, selectedOptionIds, voteOptions, totalVotes)
 * 2. onError: 실패 시 스냅샷으로 롤백
 * 3. onSettled: 최종적으로 서버 상태와 동기화
 */

function getVoteCount() {}

function getPercentage() {}

interface UseVoteReturn {
  castVoteItem: (data: { voteOptionIds: number[] }) => void;
  changeVoteItem: (data: { voteOptionIds: number[] }) => void;
  cancelVoteItem: () => void;
  isPending: boolean;
}

export function useVote(votesboardId: number) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const voteQueryKey = getGetVotePostQueryKey(votesboardId);

  const castVoteMutation = useCastVote({
    mutation: {
      onMutate: async ({ data: { voteOptionIds } }) => {
        // 진행 중인 쿼리 취소
        await queryClient.cancelQueries({ queryKey: voteQueryKey });

        // 스냅샷 저장
        const snapshot =
          queryClient.getQueryData<VoteboardDetailResponse>(
            voteQueryKey,
          );

        if (!snapshot) return { snapshot: null };

        // 낙관적 업데이트 계산
        const newVoteOptions = snapshot.voteOptions.map((option) => {
          const isSelected = voteOptionIds.includes(option.id);
          const wasSelected =
            snapshot.voteInfo.selectedOptionIds.includes(option.id);

          // 투표 수 변화 계산
          let newVoteCount = option.voteCount;
          if (isSelected && !wasSelected) {
            newVoteCount += 1;
          } else if (!isSelected && wasSelected) {
            newVoteCount -= 1;
          }

          return {
            ...option,
            voteCount: newVoteCount,
          };
        });

        // 새로운 총 투표수 계산
        const hadVoted =
          snapshot.voteInfo.selectedOptionIds.length > 0;
        const newTotalVotes = hadVoted
          ? snapshot.voteInfo.totalVotes
          : snapshot.voteInfo.totalVotes + 1;

        // 퍼센트 재계산
        const optionsWithPercentage = newVoteOptions.map(
          (option) => ({
            ...option,
            percentage:
              newTotalVotes > 0
                ? Math.round((option.voteCount / newTotalVotes) * 100)
                : 0,
          }),
        );

        // 쿼리 캐시 업데이트
        queryClient.setQueryData<VoteboardDetailResponse>(
          voteQueryKey,
          {
            ...snapshot,
            hasVoted: true,
            voteInfo: {
              ...snapshot.voteInfo,
              selectedOptionIds: voteOptionIds,
              totalVotes: newTotalVotes,
            },
            voteOptions: optionsWithPercentage,
          },
        );

        return { snapshot };
      },

      onError: (_error, _variables, context) => {
        // 실패 시 스냅샷으로 롤백
        if (context?.snapshot) {
          queryClient.setQueryData(voteQueryKey, context.snapshot);
        }
        toast(
          '투표 중 오류가 발생했습니다. 다시 시도해주세요.',
          'error',
        );
      },

      onSuccess: () => {
        toast('투표가 완료되었습니다!', 'success');
      },

      onSettled: () => {
        // 성공/실패와 무관하게 최종적으로 서버 상태와 동기화
        queryClient.invalidateQueries({ queryKey: voteQueryKey });
      },
    },
  });

  return {
    castVote: castVoteMutation.mutate,
    isPending: castVoteMutation.isPending,
  };
}
