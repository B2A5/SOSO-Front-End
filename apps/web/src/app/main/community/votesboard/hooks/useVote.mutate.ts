'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/ui/useToast';
import {
  useCastVote,
  useChangeVote,
  useCancelVote,
  getGetPollQueryKey,
} from '@/generated/api/endpoints/poll/poll';

export interface UseVoteReturn {
  cast: (voteOptionIds: number[]) => void;
  change: (voteOptionIds: number[]) => void;
  cancel: () => void;
  isPending: boolean;
}

const VOTE_ERROR_MESSAGES = {
  CAST: '투표 중 오류가 발생했습니다. 다시 시도해주세요.',
  CHANGE: '재투표 중 오류가 발생했습니다. 다시 시도해주세요.',
  CANCEL: '투표 취소 중 오류가 발생했습니다.',
} as const;

export function useVote(pollId: number): UseVoteReturn {
  const queryClient = useQueryClient();
  const toast = useToast();

  const voteQueryKey = getGetPollQueryKey(pollId);

  const onSettled = () => {
    queryClient.invalidateQueries({ queryKey: voteQueryKey });
  };

  const castVoteMutation = useCastVote({
    mutation: {
      onError: () => toast(VOTE_ERROR_MESSAGES.CAST, 'error'),
      onSettled,
    },
  });

  const changeVoteMutation = useChangeVote({
    mutation: {
      onError: () => toast(VOTE_ERROR_MESSAGES.CHANGE, 'error'),
      onSettled,
    },
  });

  const cancelVoteMutation = useCancelVote({
    mutation: {
      onError: () => toast(VOTE_ERROR_MESSAGES.CANCEL, 'error'),
      onSettled,
    },
  });

  return {
    cast: (voteOptionIds) =>
      castVoteMutation.mutate({ pollId, data: { voteOptionIds } }),
    change: (voteOptionIds) =>
      changeVoteMutation.mutate({ pollId, data: { voteOptionIds } }),
    cancel: () => cancelVoteMutation.mutate({ pollId }),
    isPending:
      castVoteMutation.isPending ||
      changeVoteMutation.isPending ||
      cancelVoteMutation.isPending,
  };
}
