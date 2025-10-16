import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/ui/useToast';
import {
  useCreatePost,
  useUpdatePost,
} from '@/generated/api/endpoints/freeboard/freeboard';
import type { FreeboardFormData } from '@/app/main/community/schema/freeboardSchema';

/**
 * 자유게시판 게시글 생성/수정 통합 Mutation Hook
 *
 * @description
 * 게시글 생성과 수정 로직을 하나의 인터페이스로 통합한 커스텀 훅입니다.
 * freeboardId 유무에 따라 자동으로 생성/수정 API를 선택합니다.
 *
 * @param freeboardId - 수정할 게시글 ID (없으면 생성 모드)
 *
 * @returns
 * - submitPost: 폼 데이터를 제출하는 함수
 * - isPending: 생성/수정 요청이 진행 중인지 여부
 *
 * @remarks
 * - 생성 성공 시: /community/freeboard로 리다이렉트
 * - 수정 성공 시: /community/freeboard/[freeboardId]로 리다이렉트
 * - 에러 발생 시: 에러 토스트 표시
 * - FormData는 내부적으로 API 스펙에 맞게 변환됩니다
 */
export function useFreeboardMutation(freeboardId?: number) {
  const router = useRouter();
  const toast = useToast();

  // 생성 mutation
  const createMutation = useCreatePost({
    mutation: {
      onSuccess: () => {
        toast('게시글이 성공적으로 작성되었습니다.', 'success');
        router.push('/main/community/freeboard');
      },
      onError: () => {
        toast(
          '게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.',
          'error',
        );
      },
    },
  });

  // 수정 mutation
  const updateMutation = useUpdatePost({
    mutation: {
      onSuccess: () => {
        toast('게시글이 성공적으로 수정되었습니다.', 'success');
        router.push(`/main/community/freeboard/${freeboardId}`);
      },
      onError: () => {
        toast(
          '게시글 수정 중 오류가 발생했습니다. 다시 시도해주세요.',
          'error',
        );
      },
    },
  });

  /**
   * 게시글 제출 함수
   *
   * @param data - Zod 스키마로 검증된 폼 데이터
   * @param deleteImageIds - 삭제할 기존 이미지 ID 목록 (수정 모드에서 사용)
   *
   * @remarks
   * freeboardId 유무에 따라 자동으로 생성/수정 API를 호출합니다.
   * 카테고리는 프론트엔드 형식(kebab-case)에서 백엔드 형식(UPPERCASE)으로 변환됩니다.
   */
  const submitPost = (
    data: FreeboardFormData,
    deleteImageIds?: number[],
  ) => {
    if (freeboardId) {
      // 수정 모드: PATCH 요청
      updateMutation.mutate({
        freeboardId: freeboardId,
        data: {
          category: data.category,
          title: data.title,
          content: data.content,
          images: data.images,
          deleteImageIds: deleteImageIds,
        },
      });
    } else {
      // 생성 모드: POST 요청
      createMutation.mutate({
        data: {
          category: data.category,
          title: data.title,
          content: data.content,
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
