'use client';

import { X } from 'lucide-react';
import Input from '@/components/inputs/Input';
import type { VoteboardFormData } from '../schema/voteboardSchema';
import type { UseFormRegister } from 'react-hook-form';

interface VoteboardOptionFieldProps {
  /** 옵션 인덱스 (0부터 시작) */
  index: number;
  /** react-hook-form register (VoteFormData 기반) */
  register: UseFormRegister<VoteboardFormData>;
  /** 해당 옵션의 에러 메시지 (content 기준) */
  errorMessage?: string;
  /** 삭제 버튼 노출 여부 */
  canRemove: boolean;
  /** 옵션 삭제 핸들러 */
  onRemove: () => void;
}

/**
 * 투표 옵션 단일 필드 컴포넌트
 *
 * @description
 * - index에 따라 플레이스홀더를 다르게 표시합니다.
 *   - 0번: "찬성"
 *   - 1번: "반대"
 *   - 그 외: "투표 옵션을 입력하세요"
 *
 * @remarks
 * - 실제 값은 사용자가 입력한 content이며, placeholder는 힌트용입니다.
 */
export function VoteboardOptionField({
  index,
  register,
  errorMessage,
  canRemove,
  onRemove,
}: VoteboardOptionFieldProps) {
  const getPlaceholder = (i: number) => {
    if (i === 0) return '찬성';
    if (i === 1) return '반대';
    return '투표 옵션을 입력하세요';
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        id={`option-${index}`}
        placeholder={getPlaceholder(index)}
        isError={!!errorMessage}
        errorMessage={errorMessage}
        {...register(`voteOptions.${index}.content` as const)}
      />
      {canRemove && (
        <button
          type="button"
          className="text-xs text-neutral-400"
          onClick={onRemove}
          aria-label={`옵션 ${index + 1} 삭제`}
        >
          <X className="inline-block w-4 h-4" />
        </button>
      )}
    </div>
  );
}
