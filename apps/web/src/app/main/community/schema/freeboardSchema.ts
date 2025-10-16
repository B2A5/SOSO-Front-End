import { z } from 'zod';
import { CategoryEnum } from '../constants/categories';

/**
 * 자유게시판 게시글 작성/수정 폼 Validation 스키마
 *
 * @description
 * Zod를 사용한 타입 안전한 폼 validation 스키마입니다.
 * react-hook-form의 zodResolver와 함께 사용됩니다.
 *
 * @see {@link https://zod.dev Zod 공식 문서}
 *
 * @remarks
 * - 백엔드 API 스펙과 일치하도록 제약 조건을 설정했습니다
 * - 스키마에서 TypeScript 타입이 자동으로 추론됩니다
 * - validation 규칙 변경 시 이 파일만 수정하면 됩니다
 *
 */

/**
 * 자유게시판 게시글 폼 스키마
 *
 * @property {string} title - 게시글 제목
 * @property {string} content - 게시글 내용
 * @property {Category} category - 게시글 카테고리
 * @property {File[]} [images] - 첨부 이미지 배열 (선택)
 */
export const freeboardSchema = z.object({
  /**
   * 게시글 제목
   *
   * @validation
   * - 필수 입력 (최소 1자)
   * - 최대 20자
   * - 공백만 입력 불가 (trim 후 길이 체크)
   *
   * @remarks
   * 간결한 제목 작성을 유도하기 위해 20자로 제한했습니다.
   * 사용자 경험을 위해 공백 trim 검증을 추가했습니다.
   */
  title: z
    .string()
    .min(1, '제목은 필수입니다.')
    .max(20, '제목은 최대 20자까지 입력 가능합니다.')
    .refine(
      (val) => val.trim().length > 0,
      '공백만 입력할 수 없습니다.',
    ),

  /**
   * 게시글 내용
   *
   * @validation
   * - 필수 입력 (최소 5자)
   * - 최대 500자
   * - 공백만 입력 불가 (trim 후 길이 체크)
   *
   * @remarks
   * 백엔드 API 스펙에 맞춰 500자로 제한했습니다.
   * 최소 5자는 의미 있는 내용을 작성하도록 유도하기 위함입니다.
   */
  content: z
    .string()
    .min(5, '내용은 최소 5자 이상 입력해야 합니다.')
    .max(500, '내용은 최대 500자까지 입력 가능합니다.')
    .refine(
      (val) => val.trim().length >= 5,
      '공백을 제외하고 최소 5자 이상 입력해주세요.',
    ),

  /**
   * 게시글 카테고리
   *
   * @validation
   * - 필수 선택
   * - 허용된 카테고리만 선택 가능
   *
   * @remarks
   * z.enum을 사용하여 런타임·타입 모두 안전하게 검증합니다.
   * Generated API의 enum-like 객체 값들과 일치하도록 설정했습니다.
   *
   * @see {@link GetPostsByCursorCategory}
   */
  category: z.enum(
    Object.values(CategoryEnum) as [string, ...string[]],
  ),

  /**
   * 첨부 이미지 파일 배열
   *
   * @validation
   * - 선택 사항 (optional)
   * - 최대 4장 제한 (API 스펙 기준)
   * - Blob 객체 허용 (File은 Blob의 서브타입이므로 자동 호환)
   *
   * @remarks
   * - 파일 타입 및 크기 검증은 ImageInput 컴포넌트에서 처리합니다
   * - API 스펙에 맞춰 Blob[] 타입을 사용합니다
   * - 브라우저 File input은 File 객체를 반환하며, File은 Blob을 상속하므로 호환됩니다
   * - 타입 안전성을 위해 API 스펙과 정확히 일치시켰습니다
   *
   * @see {@link ImageUploader}
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

/**
 * 폼 데이터 타입
 *
 * @description
 * freeboardSchema에서 자동으로 추론된 TypeScript 타입입니다.
 * react-hook-form의 제네릭 타입으로 사용됩니다.
 *
 * @remarks
 * z.infer를 사용하면 스키마 정의와 타입이 항상 동기화됩니다.
 * 타입을 별도로 관리할 필요가 없어 Single Source of Truth를 유지합니다.
 */
export type FreeboardFormData = z.infer<typeof freeboardSchema>;
