'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { VoteboardDetailResponse } from '@/generated/api/models';
import { useCastVote } from '@/generated/api/endpoints/voteboard/voteboard';
import { cn } from '@/utils/cn';

interface VoteSectionProps {
  voteData: VoteboardDetailResponse;
  onVoteSuccess?: () => void;
}

export function VoteSection({
  voteData,
  onVoteSuccess,
}: VoteSectionProps) {
  const {
    postId,
    voteOptions,
    totalVotes,
    hasVoted,
    selectedOptionIds = [],
    allowMultipleChoice,
    voteStatus,
  } = voteData;

  const [selectedOptions, setSelectedOptions] =
    useState<number[]>(selectedOptionIds);
  const [showResults, setShowResults] = useState(hasVoted);

  const castVoteMutation = useCastVote();

  const isVotingClosed = voteStatus === 'COMPLETED';
  const canVote = !hasVoted && !isVotingClosed;

  const handleOptionSelect = (optionId: number) => {
    if (!canVote || showResults) return;

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

  const handleSubmitVote = async () => {
    if (selectedOptions.length === 0) {
      alert('투표할 항목을 선택해주세요.');
      return;
    }

    try {
      await castVoteMutation.mutateAsync({
        votesboardId: postId,
        data: { voteOptionIds: selectedOptions },
      });

      setShowResults(true);
      onVoteSuccess?.();
    } catch (error) {
      console.error('투표 실패:', error);
      alert('투표 중 오류가 발생했습니다.');
    }
  };

  return (
    <section className="w-full px-4 py-6">
      {/* 참여자 수 */}
      <div className="mb-4 text-sm text-neutral-600">
        {totalVotes} 명 참여중
      </div>

      {/* 투표 옵션 목록 */}
      <div className="flex flex-col gap-3 mb-6">
        <AnimatePresence mode="wait">
          {showResults ? (
            // 투표 결과 표시
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              {voteOptions
                .sort((a, b) => a.sequence - b.sequence)
                .map((option) => {
                  const isSelected = selectedOptions.includes(
                    option.id,
                  );
                  return (
                    <VoteResultOption
                      key={option.id}
                      option={option}
                      isSelected={isSelected}
                    />
                  );
                })}
            </motion.div>
          ) : (
            // 투표 선택 UI
            <motion.div
              key="voting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              {voteOptions
                .sort((a, b) => a.sequence - b.sequence)
                .map((option) => {
                  const isSelected = selectedOptions.includes(
                    option.id,
                  );
                  return (
                    <VoteOption
                      key={option.id}
                      option={option}
                      isSelected={isSelected}
                      onSelect={() => handleOptionSelect(option.id)}
                      disabled={!canVote}
                      allowMultipleChoice={allowMultipleChoice}
                    />
                  );
                })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 투표하기 버튼 */}
      {!showResults && canVote && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={handleSubmitVote}
          disabled={
            selectedOptions.length === 0 || castVoteMutation.isPending
          }
          className={cn(
            'w-full h-12 rounded-lg font-medium text-white transition-all',
            'bg-primary-500 hover:bg-primary-600 active:bg-primary-700',
            'disabled:bg-neutral-300 disabled:cursor-not-allowed',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          )}
        >
          {castVoteMutation.isPending ? '투표 중...' : '투표하기'}
        </motion.button>
      )}

      {isVotingClosed && !showResults && (
        <div className="text-center text-neutral-500">
          마감된 투표입니다
        </div>
      )}
    </section>
  );
}

// 투표 선택 옵션 컴포넌트
interface VoteOptionProps {
  option: { id: number; content: string };
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
  allowMultipleChoice: boolean;
}

function VoteOption({
  option,
  isSelected,
  onSelect,
  disabled,
  allowMultipleChoice,
}: VoteOptionProps) {
  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        'relative w-full px-4 py-3.5 rounded-lg text-left',
        'border-2 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-neutral-200 bg-white hover:border-neutral-300',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <div className="flex items-center gap-3">
        {/* 라디오/체크박스 아이콘 */}
        <div
          className={cn(
            'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
            isSelected
              ? 'border-primary-500 bg-primary-500'
              : 'border-neutral-300',
            allowMultipleChoice && 'rounded-md',
          )}
        >
          <motion.div
            initial={false}
            animate={{
              scale: isSelected ? 1 : 0,
              opacity: isSelected ? 1 : 0,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {allowMultipleChoice ? (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            )}
          </motion.div>
        </div>

        {/* 옵션 텍스트 */}
        <span className="text-base">{option.content}</span>
      </div>
    </motion.button>
  );
}

// 투표 결과 옵션 컴포넌트
interface VoteResultOptionProps {
  option: {
    id: number;
    content: string;
    voteCount: number;
    percentage: number;
  };
  isSelected: boolean;
}

function VoteResultOption({
  option,
  isSelected,
}: VoteResultOptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative w-full px-4 py-3.5 rounded-lg overflow-hidden',
        'border-2',
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-neutral-200 bg-white',
      )}
    >
      {/* 배경 프로그레스 바 */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${option.percentage}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={cn(
          'absolute inset-y-0 left-0 rounded-lg',
          isSelected ? 'bg-primary-100' : 'bg-neutral-100',
        )}
      />

      {/* 내용 */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isSelected && (
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          <span className="text-base font-medium">
            {option.content}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-600">
            {option.voteCount}표
          </span>
          <span className="font-semibold text-primary-600">
            {option.percentage}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
