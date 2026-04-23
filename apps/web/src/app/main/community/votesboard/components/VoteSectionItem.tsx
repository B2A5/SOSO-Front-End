'use client';

import type { PollOptionResponse } from '@/generated/api/models';
import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * VoteSectionItem - 투표 옵션 아이템
 */
interface VoteSectionItemProps {
  isIndex?: boolean; //@todo: 이후 구현할 prop
  option: PollOptionResponse;
  isSelected: boolean;
  mode: 'selection' | 'result';
  onSelect?: () => void;
}

export function VoteSectionItem({
  option,
  isSelected,
  mode,
  onSelect,
}: VoteSectionItemProps) {
  if (mode === 'result') {
    return (
      <div
        className={cn(
          'relative px-[14px] py-[13px] rounded-lg overflow-hidden h-[46px] flex items-center',
          isSelected ? 'bg-soso-0' : 'bg-neutral-0',
        )}
      >
        {/* 진행 바 */}
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${option.percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={cn(
            'absolute inset-y-0 left-0 rounded-lg',
            isSelected ? 'bg-soso-300' : 'bg-neutral-100',
          )}
        />

        {/* 내용 */}
        <div className="relative flex w-full items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-base font-semibold text-neutral-900 tracking-[-0.02em]">
              {option.content}
            </span>
            <span className="text-xs font-semibold text-neutral-600">
              {option.percentage}%
            </span>
          </div>
          <Check
            className={cn(
              'w-6 h-6',
              isSelected ? 'block text-neutral-900' : 'hidden',
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full px-[14px] py-[13px] rounded-lg text-left transition-colors',

        'flex items-center gap-3 justify-between',
        isSelected
          ? 'bg-white border border-soso-500 dark:bg-soso-900/20'
          : 'bg-offwhite dark:bg-neutral-800 hover:bg-neutral-0 dark:hover:bg-neutral-700',
      )}
    >
      <span className="font-medium">{option.content}</span>
      <Check
        className={cn('w-6 h-6', isSelected ? 'block ' : 'hidden')}
      />
    </button>
  );
}
