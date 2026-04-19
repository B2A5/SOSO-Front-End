'use client';

import type { PollOptionResponse } from '@/generated/api/models';
import { cn } from '@/utils/cn';

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
      <div className="relative px-4 py-3 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {/* 그래프 바 (배경) */}
        <div
          style={{ width: `${option.percentage}%` }}
          className={cn(
            'absolute inset-y-0 left-0 rounded-lg transition-all duration-300',
            isSelected
              ? 'bg-soso-400 dark:bg-soso-600'
              : 'bg-neutral-300 dark:bg-neutral-700',
          )}
        />

        {/* 내용 */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center',
                isSelected
                  ? 'border-soso-500 bg-soso-500'
                  : 'border-neutral-400 dark:border-neutral-500',
              )}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              )}
            </div>
            <span className="font-medium">{option.content}</span>
          </div>
          <span className="font-bold text-soso-600 dark:text-soso-400">
            {option.percentage}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full px-4 py-3 rounded-lg text-left transition-colors',
        'flex items-center gap-3',
        isSelected
          ? 'bg-soso-50 dark:bg-soso-900/20'
          : 'bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700',
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
          isSelected
            ? 'border-soso-500 bg-soso-500'
            : 'border-neutral-300 dark:border-neutral-600',
        )}
      >
        {isSelected && (
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        )}
      </div>
      <span className="font-medium">{option.content}</span>
    </button>
  );
}
