import { z } from 'zod';
import { CategoryEnum } from '../../constants/categories';

/**
 * 마감 기간 값들
 *
 * @description
 * - '1d'  : 1일 뒤 마감
 * - '3d'  : 3일 뒤 마감
 * - '7d'  : 7일 뒤 마감
 */
export const VOTE_DURATION_VALUES = ['1d', '3d', '7d'] as const;
export type VoteDuration = (typeof VOTE_DURATION_VALUES)[number];

/**
 * 투표 게시글 작성/수정 폼 Validation 스키마
 *
 * @description
 * 백엔드 API 스펙(PollCreateRequest / PollUpdateRequest)에
 * 맞춰 정의한 Zod 스키마입니다.
 * react-hook-form의 zodResolver와 함께 사용됩니다.
 */
export const voteboardSchema = z.object({
  /**
   * 게시글 카테고리
   *
   * @validation
   * - 필수 선택
   * - 허용된 카테고리만 선택 가능
   */
  category: z.enum(Object.values(CategoryEnum)),

  /**
   * 투표 제목
   *
   * @validation
   * - 필수
   * - 최대 100자
   * - 공백만 입력 불가
   */
  title: z
    .string()
    .min(1, '제목은 필수입니다.')
    .max(100, '제목은 최대 100자까지 입력 가능합니다.')
    .refine((v) => v.trim().length > 0, '공백만 입력할 수 없습니다.'),

  /**
   * 투표 내용
   *
   * @validation
   * - 필수
   * - 최대 5000자
   * - 공백만 입력 불가
   */
  content: z
    .string()
    .min(1, '내용은 필수입니다.')
    .max(5000, '내용은 최대 5000자까지 입력 가능합니다.')
    .refine((v) => v.trim().length > 0, '공백만 입력할 수 없습니다.'),

  /**
   * 마감 기간 선택
   *
   * @remarks
   * - UI에서는 셀렉터로 1일 / 3일 / 7일 중 하나를 선택합니다.
   * - 실제 closedAt(yyyy-MM-ddTHH:mm:ss)은 submit 시점에
   *   현재 시간을 기준으로 계산해서 서버로 전송합니다.
   */
  duration: z.enum(VOTE_DURATION_VALUES, {
    message: '마감 기간을 선택해주세요.',
  }),

  /**
   * 재투표 허용 여부
   */
  canRevote: z.boolean(),

  /**
   * 중복 선택 허용 여부
   */
  canMultiSelect: z.boolean(),

  /**
   * 투표 옵션 목록
   *
   * @validation
   * - 최소 2개 ~ 최대 5개
   * - content 필드(API PollOptionRequest 스펙 기준)
   */
  options: z
    .array(
      z.object({
        content: z
          .string()
          .min(1, '옵션은 최소 1자 이상이어야 합니다.')
          .max(50, '옵션은 최대 50자까지 입력 가능합니다.')
          .refine(
            (v) => v.trim().length > 0,
            '공백만 입력할 수 없습니다.',
          ),
      }),
    )
    .min(2, '옵션은 최소 2개 이상이어야 합니다.')
    .max(5, '옵션은 최대 5개까지 추가할 수 있습니다.'),

  /**
   * 첨부 이미지 파일 배열
   *
   * @validation
   * - 선택 사항 (optional)
   * - 최대 4장 제한 (API 스펙 기준)
   *
   * @remarks
   * - Freeboard와 동일하게 Blob(File) 배열을 사용합니다.
   * - 파일 타입 및 크기 검증은 ImageUploader 컴포넌트에서 처리합니다.
   */
  images: z
    .array(
      z.instanceof(Blob, {
        message: '유효한 파일이 아닙니다.',
      }),
    )
    .max(4, '이미지는 최대 4장까지 업로드할 수 있습니다.')
    .optional(),
});

export type VoteboardFormData = z.infer<typeof voteboardSchema>;
