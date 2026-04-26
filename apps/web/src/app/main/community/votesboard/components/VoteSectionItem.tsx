'use client';

import { memo } from 'react';
import type { PollOptionResponse } from '@/generated/api/models';
import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Pressable } from '@/components/primitives/Pressable';

interface VoteSectionItemProps {
  isIndex?: boolean; //@todo: 버튼 라벨이 필요하다면 추가 예정
  option: PollOptionResponse;
  isSelected: boolean;
  mode: 'selection' | 'result';
  onSelect?: () => void;
}

export const VoteSectionItem = memo(function VoteSectionItem({
  option,
  isSelected,
  mode,
  onSelect,
}: VoteSectionItemProps) {
  const isResult = mode === 'result';

  return (
    <Pressable>
      <button
        onClick={onSelect}
        disabled={isResult}
        className={cn(
          'relative w-full px-[14px] py-[13px] rounded-lg text-left overflow-hidden',
          'flex items-center justify-between gap-2.5',
          isResult
            ? isSelected
              ? 'bg-soso-0'
              : 'bg-neutral-0'
            : isSelected
              ? 'bg-white border border-soso-500 dark:bg-soso-900/20'
              : 'bg-offwhite dark:bg-neutral-800 hover:bg-neutral-0 dark:hover:bg-neutral-700',
        )}
      >
        {/* 진행 바 */}
        <AnimatePresence>
          {isResult && (
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${option.percentage}%` }}
              exit={{ width: '0%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={cn(
                'absolute inset-y-0 left-0 rounded-lg',
                isSelected ? 'bg-soso-300' : 'bg-neutral-100',
              )}
            />
          )}
        </AnimatePresence>

        {/* 내용 */}
        <div className="relative flex items-center gap-1.5 shrink-0">
          <span
            className={cn(
              'font-medium text-neutral-900',
              isResult &&
                'text-base font-semibold tracking-[-0.02em]',
            )}
          >
            {option.content}
          </span>
          {isResult && (
            <span className="text-xs font-semibold text-neutral-600">
              {option.percentage}%
            </span>
          )}
        </div>

        <Check
          className={cn(
            'relative w-6 h-6',
            isSelected ? 'block ' : 'hidden',
          )}
        />
      </button>
    </Pressable>
  );
});
