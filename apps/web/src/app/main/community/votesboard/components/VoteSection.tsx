'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type {
  VoteInfo,
  VoteOptionResponse,
} from '@/generated/api/models';
import { useCastVote } from '@/generated/api/endpoints/voteboard/voteboard';
import { cn } from '@/utils/cn';

interface VoteSectionProps {
  votesboardId: number;
  voteInfo: VoteInfo;
  voteOptions: VoteOptionResponse[];
  hasVoted: boolean;
  onVoteSuccess?: () => void;
}

export function VoteSection({
  votesboardId,
  voteInfo,
  voteOptions,
  hasVoted,
}: VoteSectionProps) {
  const {
    totalVotes,
    selectedOptionIds = [],
    allowMultipleChoice,
    allowRevote,
    voteStatus,
  } = voteInfo;

  const [selectedOptions, setSelectedOptions] =
    useState<number[]>(selectedOptionIds);
  const [showResults, setShowResults] = useState(hasVoted);
  // 투표가 완료
  const [isRevoting, setIsRevoting] = useState(false);

  // 투표 참여 뮤테이션
  const castVoteMutation = useCastVote({
    mutation: {
      onSuccess: () => {
        setShowResults(true);
        setIsRevoting(false);
      },
      onError: (error: unknown) => {
        console.error('투표 실패:', error);
        alert('투표 중 오류가 발생했습니다.');
      },
    },
  });

  const isVotingClosed = voteStatus === 'COMPLETED';
  const canVote =
    (!hasVoted || (allowRevote && isRevoting)) && !isVotingClosed;
  const canRevote = hasVoted && allowRevote && !isVotingClosed;

  const handleOptionSelect = (optionId: number) => {
    if (!canVote || (showResults && !isRevoting)) return;

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

  const handleSubmitVote = () => {
    if (selectedOptions.length === 0) {
      alert('투표할 항목을 선택해주세요.');
      return;
    }

    castVoteMutation.mutate({
      votesboardId,
      data: { voteOptionIds: selectedOptions },
    });
  };

  const handleRevote = () => {
    setIsRevoting(true);
    setShowResults(false);
    setSelectedOptions([]);
  };

  const handleCancelRevote = () => {
    setIsRevoting(false);
    setShowResults(true);
    setSelectedOptions(selectedOptionIds);
  };

  return (
    <section className="w-full px-4 py-6">
      {/* 헤더: 참여자 수 & 재투표 버튼 */}
      <div className="flex items-center justify-between mb-5">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm font-medium text-neutral-600 dark:text-neutral-400"
        >
          {totalVotes.toLocaleString()}명 참여중
        </motion.div>

        {canRevote && showResults && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRevote}
            className="px-3 py-1.5 text-xs font-medium text-soso-600 bg-soso-50 rounded-full hover:bg-soso-100 transition-colors"
          >
            재투표
          </motion.button>
        )}
      </div>

      {/* 투표 옵션 목록 */}
      <div className="flex flex-col gap-2.5 mb-6">
        <AnimatePresence mode="wait">
          {showResults && !isRevoting ? (
            // 투표 결과 표시
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2.5"
            >
              {voteOptions
                .sort((a, b) => a.sequence - b.sequence)
                .map((option, index) => {
                  const isSelected = selectedOptionIds.includes(
                    option.id,
                  );
                  return (
                    <VoteResultOption
                      key={option.id}
                      option={option}
                      index={index}
                      isSelected={isSelected}
                    />
                  );
                })}
            </motion.div>
          ) : (
            // 투표 선택 UI
            <motion.div
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2.5"
            >
              {voteOptions
                .sort((a, b) => a.sequence - b.sequence)
                .map((option, index) => {
                  const isSelected = selectedOptions.includes(
                    option.id,
                  );
                  return (
                    <VoteOption
                      key={option.id}
                      option={option}
                      index={index}
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

      {/* 액션 버튼 영역 */}
      <AnimatePresence mode="wait">
        {!showResults && canVote && (
          <motion.div
            key="vote-actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-2"
          >
            {isRevoting && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleCancelRevote}
                className="flex-1 h-12 rounded-xl font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
              >
                취소
              </motion.button>
            )}
            <motion.button
              whileHover={{
                scale: selectedOptions.length > 0 ? 1.02 : 1,
              }}
              whileTap={{
                scale: selectedOptions.length > 0 ? 0.98 : 1,
              }}
              onClick={handleSubmitVote}
              disabled={
                selectedOptions.length === 0 ||
                castVoteMutation.isPending
              }
              className={cn(
                'h-12 rounded-xl font-semibold text-white transition-all shadow-sm',
                isRevoting ? 'flex-1' : 'w-full',
                selectedOptions.length > 0
                  ? 'bg-soso-500 hover:bg-soso-600 active:bg-soso-700 shadow-soso-500/20'
                  : 'bg-neutral-300 cursor-not-allowed',
              )}
            >
              {castVoteMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    ⏳
                  </motion.span>
                  투표 중...
                </span>
              ) : isRevoting ? (
                '재투표하기'
              ) : (
                '투표하기'
              )}
            </motion.button>
          </motion.div>
        )}

        {isVotingClosed && !showResults && (
          <motion.div
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-3 text-sm text-neutral-500 dark:text-neutral-400"
          >
            마감된 투표입니다
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// 투표 선택 옵션 컴포넌트 (Toss 스타일)
interface VoteOptionProps {
  option: { id: number; content: string };
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
  allowMultipleChoice: boolean;
}

function VoteOption({
  option,
  index,
  isSelected,
  onSelect,
  disabled,
  allowMultipleChoice,
}: VoteOptionProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onSelect}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        'group relative w-full px-4 py-4 rounded-2xl text-left',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soso-500 focus-visible:ring-offset-2',
        isSelected
          ? 'bg-gradient-to-br from-soso-50 to-soso-100 dark:from-soso-900/20 dark:to-soso-800/20 shadow-md shadow-soso-500/10'
          : 'bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-700',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <div className="flex items-center gap-3">
        {/* 번호 라벨 (Toss 스타일) */}
        <motion.div
          animate={{
            backgroundColor: isSelected
              ? 'rgb(var(--color-soso-500))'
              : 'rgb(229, 231, 235)',
            color: isSelected ? '#fff' : 'rgb(107, 114, 128)',
          }}
          className={cn(
            'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm',
            'transition-colors',
          )}
        >
          {index + 1}
        </motion.div>

        {/* 체크박스/라디오 */}
        <div
          className={cn(
            'flex-shrink-0 w-5 h-5 flex items-center justify-center transition-all',
            'border-2 rounded-full',
            isSelected
              ? 'border-soso-500 bg-soso-500'
              : 'border-neutral-300 dark:border-neutral-600',
            allowMultipleChoice && 'rounded-md',
          )}
        >
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 25,
                }}
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
            )}
          </AnimatePresence>
        </div>

        {/* 옵션 텍스트 */}
        <span
          className={cn(
            'text-base font-medium transition-colors',
            isSelected
              ? 'text-soso-700 dark:text-soso-300'
              : 'text-neutral-800 dark:text-neutral-200',
          )}
        >
          {option.content}
        </span>
      </div>
    </motion.button>
  );
}

// 투표 결과 옵션 컴포넌트 (Toss 스타일)
interface VoteResultOptionProps {
  option: {
    id: number;
    content: string;
    voteCount: number;
    percentage: number;
  };
  index: number;
  isSelected: boolean;
}

function VoteResultOption({
  option,
  index,
  isSelected,
}: VoteResultOptionProps) {
  const isTopChoice = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        'relative w-full px-4 py-4 rounded-2xl overflow-hidden',
        'transition-all duration-300',
        isSelected
          ? 'bg-gradient-to-br from-soso-50 to-soso-100 dark:from-soso-900/20 dark:to-soso-800/20 shadow-md shadow-soso-500/10'
          : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
      )}
    >
      {/* 배경 프로그레스 바 */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${option.percentage}%` }}
        transition={{
          duration: 1,
          delay: index * 0.1,
          ease: [0.4, 0, 0.2, 1],
        }}
        className={cn(
          'absolute inset-y-0 left-0 rounded-2xl',
          isSelected
            ? 'bg-gradient-to-r from-soso-200/40 to-soso-300/40 dark:from-soso-700/30 dark:to-soso-600/30'
            : 'bg-neutral-100 dark:bg-neutral-700/50',
        )}
      />

      {/* 내용 */}
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* 번호 라벨 */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
            className={cn(
              'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm',
              isSelected
                ? 'bg-soso-500 text-white'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400',
            )}
          >
            {index + 1}
          </motion.div>

          {/* 선택 체크마크 */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 25,
                }}
                className="flex-shrink-0 w-5 h-5 rounded-full bg-soso-500 flex items-center justify-center"
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* 옵션 텍스트 */}
          <span
            className={cn(
              'text-base font-medium truncate',
              isSelected
                ? 'text-soso-700 dark:text-soso-300'
                : 'text-neutral-800 dark:text-neutral-200',
            )}
          >
            {option.content}
          </span>
        </div>

        {/* 득표 정보 */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="text-sm text-neutral-600 dark:text-neutral-400"
          >
            {option.voteCount.toLocaleString()}표
          </motion.span>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.1 + 0.4,
              type: 'spring',
              stiffness: 300,
            }}
            className={cn(
              'px-2.5 py-1 rounded-lg font-bold text-sm',
              isSelected
                ? 'bg-soso-500 text-white'
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300',
            )}
          >
            {option.percentage}%
          </motion.div>
        </div>
      </div>

      {/* 최고 득표 배지 */}
      <AnimatePresence>
        {isTopChoice && option.percentage > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5 }}
            className="absolute top-2 right-2"
          >
            <span className="px-2 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-md">
              🏆 TOP
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
