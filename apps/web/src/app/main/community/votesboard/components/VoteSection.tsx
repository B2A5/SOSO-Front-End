'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import type {
  VoteInfo,
  VoteOptionResponse,
} from '@/generated/api/models';
import { useVote } from '@/app/main/community/votesboard/hooks/useVote';
import { cn } from '@/utils/cn';

interface VoteSectionProps {
  votesboardId: number;
  voteInfo: VoteInfo;
  voteOptions: VoteOptionResponse[];
  hasVoted: boolean;
}

export function VoteSection({
  votesboardId,
  voteInfo,
  voteOptions,
  hasVoted,
}: VoteSectionProps) {
  const {
    totalVotes,
    selectedOptionIds,
    allowMultipleChoice,
    allowRevote,
    voteStatus,
  } = voteInfo;

  const [selectedOptions, setSelectedOptions] =
    useState<number[]>(selectedOptionIds);
  const { cast, change, isPending } = useVote(votesboardId);

  // 파생 상태
  const isVotingClosed = voteStatus === 'COMPLETED';
  const canVote = !isVotingClosed && !hasVoted;
  const canRevote = !isVotingClosed && hasVoted && allowRevote;

  // 이벤트 핸들러
  const handleOptionSelect = (optionId: number) => {
    if (allowMultipleChoice) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId],
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      alert('투표할 항목을 선택해주세요.');
      return;
    }

    if (hasVoted) {
      change(selectedOptions);
    } else {
      cast(selectedOptions);
    }
  };

  const handleRevote = () => {
    setSelectedOptions([]);
  };

  const handleShare = () => {
    // TODO: 공유 기능 구현
    alert('공유 기능 준비 중입니다.');
  };

  // 선언적 조건부 렌더링
  if (isVotingClosed) {
    return (
      <VoteResultsView
        totalVotes={totalVotes}
        voteOptions={voteOptions}
        selectedOptionIds={selectedOptionIds}
      />
    );
  }

  if (hasVoted && !canRevote) {
    return (
      <VoteCompletedView
        totalVotes={totalVotes}
        voteOptions={voteOptions}
        selectedOptionIds={selectedOptionIds}
        allowMultipleChoice={allowMultipleChoice}
        onShare={handleShare}
      />
    );
  }

  if (hasVoted && canRevote) {
    return (
      <VoteCompletedView
        totalVotes={totalVotes}
        voteOptions={voteOptions}
        selectedOptionIds={selectedOptionIds}
        allowMultipleChoice={allowMultipleChoice}
        onShare={handleShare}
        onRevote={handleRevote}
      />
    );
  }

  return (
    <VoteSelectionView
      totalVotes={totalVotes}
      voteOptions={voteOptions}
      selectedOptions={selectedOptions}
      allowMultipleChoice={allowMultipleChoice}
      isPending={isPending}
      onOptionSelect={handleOptionSelect}
      onSubmit={handleSubmit}
    />
  );
}

// ============================================
// 하위 컴포넌트
// ============================================

/**
 * VoteHeader - 투표 헤더 정보
 */
interface VoteHeaderProps {
  totalVotes: number;
  allowMultipleChoice: boolean;
}

function VoteHeader({
  totalVotes,
  allowMultipleChoice,
}: VoteHeaderProps) {
  return (
    <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
      {totalVotes.toLocaleString()}명 참여 중
      {!allowMultipleChoice && ' · 중복 참여 불가'}
    </div>
  );
}

/**
 * VoteOption - 단일 투표 옵션
 */
interface VoteOptionProps {
  content: string;
  isSelected: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}

function VoteOption({
  content,
  isSelected,
  onSelect,
  disabled,
}: VoteOptionProps) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'w-full px-4 py-3 rounded-lg text-left transition-colors',
        'flex items-center gap-3',
        isSelected
          ? 'bg-soso-50 dark:bg-soso-900/20'
          : 'bg-neutral-50 dark:bg-neutral-800',
        !disabled && 'hover:bg-neutral-100 dark:hover:bg-neutral-700',
        disabled && 'cursor-default',
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
      <span className="font-medium">{content}</span>
    </button>
  );
}

/**
 * VoteSelectionView - 투표 선택 화면
 */
interface VoteSelectionViewProps {
  totalVotes: number;
  voteOptions: VoteOptionResponse[];
  selectedOptions: number[];
  allowMultipleChoice: boolean;
  isPending: boolean;
  onOptionSelect: (optionId: number) => void;
  onSubmit: () => void;
}

function VoteSelectionView({
  totalVotes,
  voteOptions,
  selectedOptions,
  allowMultipleChoice,
  isPending,
  onOptionSelect,
  onSubmit,
}: VoteSelectionViewProps) {
  return (
    <section className="w-full px-4 py-6">
      <VoteHeader
        totalVotes={totalVotes}
        allowMultipleChoice={allowMultipleChoice}
      />

      <div className="space-y-2 mb-4">
        {voteOptions
          .sort((a, b) => a.sequence - b.sequence)
          .map((option) => (
            <VoteOption
              key={option.id}
              content={option.content}
              isSelected={selectedOptions.includes(option.id)}
              onSelect={() => onOptionSelect(option.id)}
            />
          ))}
      </div>

      <button
        onClick={onSubmit}
        disabled={selectedOptions.length === 0 || isPending}
        className={cn(
          'w-full h-12 rounded-xl font-semibold text-white transition-colors',
          selectedOptions.length > 0
            ? 'bg-soso-500 hover:bg-soso-600'
            : 'bg-neutral-300 cursor-not-allowed',
        )}
      >
        {isPending ? '투표 중...' : '투표하기'}
      </button>
    </section>
  );
}

/**
 * VoteCompletedView - 투표 완료 화면
 */
interface VoteCompletedViewProps {
  totalVotes: number;
  voteOptions: VoteOptionResponse[];
  selectedOptionIds: number[];
  allowMultipleChoice: boolean;
  onShare: () => void;
  onRevote?: () => void;
}

function VoteCompletedView({
  totalVotes,
  voteOptions,
  selectedOptionIds,
  allowMultipleChoice,
  onShare,
  onRevote,
}: VoteCompletedViewProps) {
  return (
    <section className="w-full px-4 py-6">
      <VoteHeader
        totalVotes={totalVotes}
        allowMultipleChoice={allowMultipleChoice}
      />

      <div className="space-y-2 mb-4">
        {voteOptions
          .sort((a, b) => a.sequence - b.sequence)
          .map((option) => (
            <VoteOption
              key={option.id}
              content={option.content}
              isSelected={selectedOptionIds.includes(option.id)}
              disabled
            />
          ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onShare}
          className="flex-1 h-12 rounded-xl font-semibold text-white bg-soso-500 hover:bg-soso-600 transition-colors"
        >
          공유하기
        </button>

        {onRevote && (
          <button
            onClick={onRevote}
            className="flex-1 h-12 rounded-xl font-semibold text-neutral-700 bg-neutral-200 hover:bg-neutral-300 transition-colors"
          >
            재투표
          </button>
        )}
      </div>
    </section>
  );
}

/**
 * VoteResultOption - 투표 결과 옵션
 */
interface VoteResultOptionProps {
  option: VoteOptionResponse;
  isSelected: boolean;
}

function VoteResultOption({
  option,
  isSelected,
}: VoteResultOptionProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center',
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
        </div>
        <span className="font-bold text-soso-600">
          {option.percentage}%
        </span>
      </div>

      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${option.percentage}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'h-full rounded-full',
            isSelected ? 'bg-soso-500' : 'bg-neutral-400',
          )}
        />
      </div>
    </div>
  );
}

/**
 * VoteResultsView - 투표 결과 화면
 */
interface VoteResultsViewProps {
  totalVotes: number;
  voteOptions: VoteOptionResponse[];
  selectedOptionIds: number[];
}

function VoteResultsView({
  totalVotes,
  voteOptions,
  selectedOptionIds,
}: VoteResultsViewProps) {
  return (
    <section className="w-full px-4 py-6">
      <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
        {totalVotes.toLocaleString()} 명 참여중
      </div>

      <div className="space-y-3">
        {voteOptions
          .sort((a, b) => b.percentage - a.percentage)
          .map((option) => (
            <VoteResultOption
              key={option.id}
              option={option}
              isSelected={selectedOptionIds.includes(option.id)}
            />
          ))}
      </div>
    </section>
  );
}
