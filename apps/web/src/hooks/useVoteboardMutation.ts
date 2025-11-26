'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/ui/useToast';
import type { VoteFormData } from '@/app/main/community/votesboard/schema/voteboardSchema';
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
 * @param voteId - 수정할 투표 게시글 ID (없으면 생성 모드)
 *
 * @returns
 * - submitPost: 폼 데이터를 제출하는 함수
 * - isPending: 생성/수정 요청이 진행 중인지 여부
 *
 * @remarks
 * **생성 모드:**
 * - 성공 시: 목록 쿼리 invalidate 후, /community/vote로 리다이렉트
 *
 * **수정 모드:**
 * - 성공 시: 상세 쿼리 + 목록 쿼리 invalidate 후, /community/vote/[id]로 리다이렉트
 *
 * **공통:**
 * - 현재는 이미지 업로드를 지원하지 않습니다. (TODO: 이미지 필드 추가 시 Body에 연결 필요)
 * - 에러 발생 시: 에러 토스트 표시
 */
export function useVoteboardMutation(voteId?: number) {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  // 생성 mutation
  const createMutation = useCreateVotePost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['/community/vote'],
        });
        toast('투표가 성공적으로 생성되었습니다.', 'success');
        router.push('/main/community/vote');
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
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [`/community/vote/${voteId}`],
        });
        queryClient.invalidateQueries({
          queryKey: ['/community/vote'],
        });
        toast('투표가 성공적으로 수정되었습니다.', 'success');
        router.push(`/main/community/vote/${voteId}`);
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
   *
   * @remarks
   * voteId 유무에 따라 자동으로 생성/수정 API를 호출합니다.
   * - 생성 시: VotePostCreateRequest 스펙에 맞춰 voteOptions 포함
   * - 수정 시: VotePostUpdateRequest 스펙에 맞춰 voteOptions 없이 전송
   *
   * TODO:
   * - 이미지 업로드 스펙 확정 후 image 관련 필드 추가 및 Body에 매핑 필요
   */
  const submitPost = (data: VoteFormData) => {
    if (voteId) {
      // 수정 모드: VotePostUpdateRequest
      updateMutation.mutate({
        votesboardId: voteId,
        data: {
          title: data.title,
          content: data.content,
          endTime: data.endTime,
          allowRevote: data.allowRevote,
          allowMultipleChoice: data.allowMultipleChoice,
          // TODO: imageUrls 또는 images 필드가 추가되면 여기에서 함께 전달
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
          // TODO: imageUrls 또는 images 필드가 추가되면 여기에서 함께 전달
        },
      });
    }
  };

  return {
    submitPost,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
