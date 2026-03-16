import {
  PollCreateRequest,
  PollCreateResponse,
} from '@/generated/api/models';
import customInstance from '@/lib/api-client';

/**
 * 투표 게시글 생성 API 호출 함수 (커스텀 인덱스 표기법)
 *
 * @description
 * 백엔드 요구사항에 맞춰 인덱스 표기법을 사용하여 options을 전송합니다.
 * orval 생성 API와 달리 JSON.stringify가 아닌 인덱스 표기법을 사용합니다.
 *
 * @param pollCreateRequest - 생성할 투표 게시글 데이터
 * @param signal - 요청 취소를 위한 AbortSignal (선택 사항)
 * @returns 생성된 투표 게시글의 ID를 포함한 응답 데이터
 */
export const createVotesboard = (
  pollCreateRequest: PollCreateRequest,
  signal?: AbortSignal,
) => {
  const formData = new FormData();
  formData.append('category', pollCreateRequest.category);
  formData.append('title', pollCreateRequest.title);
  formData.append('content', pollCreateRequest.content);

  // 백엔드 요구사항에 맞춰 인덱스 표기법 사용
  // options[0].content=찬성&options[1].content=반대 형식으로 전송
  pollCreateRequest.options.forEach((value, index) => {
    formData.append(`options[${index}].content`, value.content);
  });

  formData.append('closedAt', pollCreateRequest.closedAt);
  formData.append(
    'canRevote',
    pollCreateRequest.canRevote.toString(),
  );
  formData.append(
    'canMultiSelect',
    pollCreateRequest.canMultiSelect.toString(),
  );

  if (pollCreateRequest.images !== undefined) {
    pollCreateRequest.images.forEach((value) =>
      formData.append('images', value),
    );
  }

  return customInstance<PollCreateResponse>({
    url: '/community/polls',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    signal,
  });
};
