import { z } from 'zod';

/**
 * 투표 게시글 작성/수정 폼 Validation 스키마
 *
 * @description
 * 백엔드 API 스펙(VotePostCreateRequest / VotePostUpdateRequest)에
 * 맞춰 정의한 Zod 스키마입니다.
 * react-hook-form의 zodResolver와 함께 사용됩니다.
 *
 * @remarks
 * - voteOptions는 VoteOptionRequest의 content 필드 구조를 따릅니다.
 * - 이미지 업로드는 아직 지원하지 않습니다. (TODO: 이미지 스펙 확정 후 필드 추가)
 */
export const voteboardSchema = z.object({
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
   * 투표 마감 시간
   *
   * @remarks
   * - ISO datetime 문자열
   */
  endTime: z.string().min(1, '마감 시간을 선택해주세요.'),

  /**
   * 재투표 허용 여부
   */
  allowRevote: z.boolean(),

  /**
   * 중복 선택 허용 여부
   */
  allowMultipleChoice: z.boolean(),

  /**
   * 투표 옵션 목록
   *
   * @validation
   * - 최소 2개 ~ 최대 5개
   * - content 필드(API VoteOptionRequest 스펙 기준)
   */
  voteOptions: z
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

  // TODO:
  // - 이미지 업로드 기능 및 API 스펙 확정 후,
  //   imageUrls: z.array(z.string()) 또는 images: z.array(z.instanceof(File))
  //   형태의 필드 추가 예정
});

export type VoteFormData = z.infer<typeof voteboardSchema>;
