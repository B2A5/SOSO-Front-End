'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/ui/useToast';
import type { VoteboardFormData } from '@/app/main/community/votesboard/schema/voteboardSchema';
import {
  getGetPollQueryKey,
  getGetPollsByCursorQueryKey,
  useUpdatePoll,
} from '@/generated/api/endpoints/poll/poll';
import { buildEndTimeFromDuration } from '@/utils/voteTime';
import { PollCreateRequest } from '@/generated/api/models';
import { createVotesboard } from '@/app/main/community/votesboard/new/api/votesboardCreate';

/**
 * 투표 게시글 생성/수정 통합 Mutation Hook
 *
 * @description
 * 투표 게시글 생성과 수정 로직을 하나의 인터페이스로 통합한 커스텀 훅입니다.
 * voteId 유무에 따라 자동으로 생성/수정 API를 선택합니다.
 *
 * @param voteboardId - 수정할 투표 게시글 ID (없으면 생성 모드)
 *
 * @returns
 * - submitPost: 폼 데이터를 제출하는 함수
 * - isPending: 생성/수정 요청이 진행 중인지 여부
 *
 * @remarks
 * **생성 모드:**
 * - 커스텀 API 사용 (인덱스 표기법으로 options 전송)
 * - 성공 시: 목록 쿼리 invalidate 후, /community/votesboard로 리다이렉트
 *
 * **수정 모드:**
 * - orval 생성 API 사용
 * - 성공 시: 상세 쿼리 + 목록 쿼리 invalidate 후, /community/votesboard/[id]로 리다이렉트
 *
 * **공통:**
 * - 에러 발생 시: 에러 토스트 표시
 */
export function useVoteboardMutation(voteboardId?: number) {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  // 생성 mutation
  const createMutation = useMutation({
    mutationFn: (payLoad: PollCreateRequest) => {
      return createVotesboard(payLoad);
    },
    onSuccess: (response) => {
      console.log('게시글 생성 응답:', response);
      queryClient.invalidateQueries({
        queryKey: ['/community/polls'],
      });
      toast('투표가 성공적으로 생성되었습니다.', 'success');
      router.push('/main/community/votesboard');
    },
    onError: () => {
      toast(
        '투표 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
        'error',
      );
    },
  });

  // 수정 mutation
  const updateMutation = useUpdatePoll({
    mutation: {
      onSuccess: (response) => {
        console.log('게시글 수정 응답:', response);
        queryClient.invalidateQueries({
          queryKey: getGetPollQueryKey(voteboardId!),
        });
        queryClient.invalidateQueries({
          queryKey: getGetPollsByCursorQueryKey(),
        });
        toast('투표가 성공적으로 수정되었습니다.', 'success');
        router.push(`/main/community/votesboard/${voteboardId}`);
      },
      onError: () => {
        toast(
          '투표 수정 중 오류가 발생했습니다. 다시 시도해주세요.',
          'error',
        );
      },
    },
  });

  /**
   * 투표 게시글 제출 함수
   *
   * @param data - Zod 스키마로 검증된 폼 데이터
   * @param deleteImageIds - 삭제할 기존 이미지 ID 목록 (수정 모드에서 사용)
   *
   * @remarks
   * voteId 유무에 따라 자동으로 생성/수정 API를 호출합니다.
   * - 생성 시: PollCreateRequest 스펙에 맞춰 options 포함
   * - 수정 시: PollUpdateRequest 스펙에 맞춰 options 없이 전송
   */
  const submitPost = (
    data: VoteboardFormData,
    deleteImageIds?: number[],
  ) => {
    const closedAt = buildEndTimeFromDuration(data.duration);

    if (voteboardId) {
      // 수정 모드: PollUpdateRequest
      updateMutation.mutate({
        pollId: voteboardId,
        data: {
          category: data.category,
          title: data.title,
          content: data.content,
          canRevote: data.canRevote,
          canMultiSelect: data.canMultiSelect,
          images: data.images,
          deleteImageIds: deleteImageIds,
          closedAt,
        },
      });
    } else {
      // 생성 모드: PollCreateRequest
      const payload: PollCreateRequest = {
        category: data.category,
        title: data.title,
        content: data.content,
        options: data.options,
        closedAt,
        canRevote: data.canRevote,
        canMultiSelect: data.canMultiSelect,
        images: data.images,
      };

      createMutation.mutate(payload);
    }
  };

  return {
    submitPost,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
