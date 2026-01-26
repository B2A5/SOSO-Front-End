import {
  VotesboardCreateRequest,
  VotesboardCreateResponse,
} from '@/generated/api/models';
import customInstance from '@/lib/api-client';

/**
 * 투표 게시글 생성 API 호출 함수 (커스텀 인덱스 표기법)
 *
 * @description
 * 백엔드 요구사항에 맞춰 인덱스 표기법을 사용하여 voteOptions을 전송합니다.
 * orval 생성 API와 달리 JSON.stringify가 아닌 인덱스 표기법을 사용합니다.
 *
 * @param votesboardCreateRequest - 생성할 투표 게시글 데이터
 * @param signal - 요청 취소를 위한 AbortSignal (선택 사항)
 * @returns 생성된 투표 게시글의 ID를 포함한 응답 데이터
 */
export const createVotesboard = (
  votesboardCreateRequest: VotesboardCreateRequest,
  signal?: AbortSignal,
) => {
  const formData = new FormData();
  formData.append('category', votesboardCreateRequest.category);
  formData.append('title', votesboardCreateRequest.title);
  formData.append('content', votesboardCreateRequest.content);

  // 백엔드 요구사항에 맞춰 인덱스 표기법 사용
  // voteOptions[0].content=찬성&voteOptions[1].content=반대 형식으로 전송
  votesboardCreateRequest.voteOptions.forEach((value, index) => {
    formData.append(`voteOptions[${index}].content`, value.content);
  });

  formData.append('endTime', votesboardCreateRequest.endTime);
  formData.append(
    'allowRevote',
    votesboardCreateRequest.allowRevote.toString(),
  );
  formData.append(
    'allowMultipleChoice',
    votesboardCreateRequest.allowMultipleChoice.toString(),
  );

  if (votesboardCreateRequest.images !== undefined) {
    votesboardCreateRequest.images.forEach((value) =>
      formData.append('images', value),
    );
  }

  return customInstance<VotesboardCreateResponse>({
    url: '/community/votesboard',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    signal,
  });
};
