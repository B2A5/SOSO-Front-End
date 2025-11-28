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
  /** 편집 가능 여부 */
  editable: boolean;
  /** 삭제 버튼 노출 여부 */
  canRemove: boolean;
  /** 옵션 삭제 핸들러 */
  onRemove: () => void;
}

/**
 * 투표 옵션 단일 필드 컴포넌트
 *
 * @description
 * 투표 옵션 하나를 입력받는 필드 컴포넌트입니다.
 * react-hook-form의 register를 통해 폼과 연동됩니다.
 * 삭제 버튼을 통해 옵션을 제거할 수 있습니다.
 */
export function VoteboardOptionField({
  index,
  register,
  errorMessage,
  editable,
  canRemove,
  onRemove,
}: VoteboardOptionFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        id={`option-${index}`}
        placeholder="투표 옵션을 입력하세요"
        isError={!!errorMessage}
        errorMessage={errorMessage}
        disabled={!editable}
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
