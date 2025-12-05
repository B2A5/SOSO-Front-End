import {
  VotePostCreateRequest,
  VotePostIdResponse,
} from '@/generated/api/models';
import customInstance from '@/lib/api-client';

/**
 * 투표 게시글 생성 API 호출 함수
 * @param votePostCreateRequest - 생성할 투표 게시글 데이터
 * @param signal - 요청 취소를 위한 AbortSignal (선택 사항)
 * @returns 생성된 투표 게시글의 ID를 포함한 응답 데이터
 */
export const createVotePost = (
  votePostCreateRequest: VotePostCreateRequest,
  signal?: AbortSignal,
) => {
  const formData = new FormData();
  formData.append('category', votePostCreateRequest.category);
  formData.append('title', votePostCreateRequest.title);
  formData.append('content', votePostCreateRequest.content);

  // 백엔드 요구사항에 맞춰 인덱스 표기법 사용
  votePostCreateRequest.voteOptions.forEach((value, index) => {
    formData.append(`voteOptions[${index}].content`, value.content);
  });

  formData.append('endTime', votePostCreateRequest.endTime);
  formData.append(
    'allowRevote',
    votePostCreateRequest.allowRevote.toString(),
  );
  formData.append(
    'allowMultipleChoice',
    votePostCreateRequest.allowMultipleChoice.toString(),
  );

  if (votePostCreateRequest.images !== undefined) {
    votePostCreateRequest.images.forEach((value) =>
      formData.append('images', value),
    );
  }

  return customInstance<VotePostIdResponse>({
    url: '/community/votesboard',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    signal,
  });
};
