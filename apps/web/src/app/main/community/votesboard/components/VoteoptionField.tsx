'use client';

import { X } from 'lucide-react';
import Input from '@/components/inputs/Input';
import type { VoteboardFormData } from '../schema/voteboardSchema';
import type { UseFormRegister } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';

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
    <motion.div
      className="flex items-start gap-2"
      layout
      transition={{ duration: 0.2 }}
    >
      {/* 인풋 + 에러 메시지 영역 */}
      <motion.div className="flex-1" layout>
        <Input
          id={`option-${index}`}
          placeholder="투표 옵션을 입력하세요"
          isError={!!errorMessage}
          errorMessage={errorMessage}
          disabled={!editable}
          {...register(`options.${index}.content` as const)}
        />
      </motion.div>

      {/* X 버튼: 높이 46px 박스 안에서 세로 가운데 정렬 */}
      <div className="h-[46px] flex items-center">
        <AnimatePresence initial={false}>
          {canRemove && (
            <motion.button
              key="remove"
              type="button"
              onClick={onRemove}
              aria-label={`옵션 ${index + 1} 삭제`}
              className="text-xs text-neutral-400"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
            >
              <X className="inline-block w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
