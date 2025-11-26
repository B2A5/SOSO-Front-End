'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/ui/useToast';
import type { VoteboardFormData } from '@/app/main/community/votesboard/schema/voteboardSchema';
import {
  useCreateVotePost,
  useUpdateVotePost,
} from '@/generated/api/endpoints/voteboard/voteboard';

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
 * - 성공 시: 목록 쿼리 invalidate 후, /community/voteboard로 리다이렉트
 *
 * **수정 모드:**
 * - 성공 시: 상세 쿼리 + 목록 쿼리 invalidate 후, /community/voteboard/[id]로 리다이렉트
 *
 * **공통:**
 * - 에러 발생 시: 에러 토스트 표시
 */
export function useVoteboardMutation(voteboardId?: number) {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  // 생성 mutation
  const createMutation = useCreateVotePost({
    mutation: {
      onSuccess: (response) => {
        console.log('게시글 생성 응답:', response);
        queryClient.invalidateQueries({
          queryKey: ['/community/voteboard'],
        });
        toast('투표가 성공적으로 생성되었습니다.', 'success');
        router.push('/main/community/voteboard');
      },
      onError: () => {
        toast(
          '투표 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
          'error',
        );
      },
    },
  });

  // 수정 mutation
  const updateMutation = useUpdateVotePost({
    mutation: {
      onSuccess: (response) => {
        console.log('게시글 수정 응답:', response);
        queryClient.invalidateQueries({
          queryKey: [`/community/voteboard/${voteboardId}`],
        });
        queryClient.invalidateQueries({
          queryKey: ['/community/voteboard'],
        });
        toast('투표가 성공적으로 수정되었습니다.', 'success');
        router.push(`/main/community/voteboard/${voteboardId}`);
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
   * - 생성 시: VotePostCreateRequest 스펙에 맞춰 voteOptions 포함
   * - 수정 시: VotePostUpdateRequest 스펙에 맞춰 voteOptions 없이 전송
   */
  const submitPost = (
    data: VoteboardFormData,
    deleteImageIds?: number[],
  ) => {
    if (voteboardId) {
      // 수정 모드: VotePostUpdateRequest
      updateMutation.mutate({
        votesboardId: voteboardId,
        data: {
          category: data.category,
          title: data.title,
          content: data.content,
          endTime: data.endTime,
          allowRevote: data.allowRevote,
          allowMultipleChoice: data.allowMultipleChoice,
          images: data.images,
          deleteImageIds: deleteImageIds,
        },
      });
    } else {
      // 생성 모드: VotePostCreateRequest
      createMutation.mutate({
        data: {
          title: data.title,
          category: data.category,
          content: data.content,
          voteOptions: data.voteOptions,
          endTime: data.endTime,
          allowRevote: data.allowRevote,
          allowMultipleChoice: data.allowMultipleChoice,
          images: data.images,
        },
      });
    }
  };

  return {
    submitPost,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
