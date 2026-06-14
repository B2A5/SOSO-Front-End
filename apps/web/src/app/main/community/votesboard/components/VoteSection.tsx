'use client';

import { useState, useEffect, useRef } from 'react';
import type {
  VoteInfo,
  PollOptionResponse,
} from '@/generated/api/models';
import { useVote } from '@/app/main/community/votesboard/hooks/useVote.mutate';
import { cn } from '@/utils/cn';
import { AnimatePresence, motion } from 'motion/react';
import { VoteSectionItem } from './VoteSectionItem';
import { VoteShareDrawer } from './VoteShareDrawer';
import { Button } from '@/components/buttons/Button';

interface VoteSectionProps {
  pollId: number;
  title: string;
  voteInfo: VoteInfo;
  options: PollOptionResponse[];
  hasVoted: boolean;
  /** card 모드: 선택/액션 비활성화, 버튼 숨김 (캐러셀 미리보기용) */
  mode?: 'default' | 'card';
}

type VoteMode =
  | { type: 'result' }
  | { type: 'selection'; selected: number[] };

export function VoteSection({
  pollId,
  title,
  voteInfo,
  options,
  hasVoted,
  mode: displayMode = 'default',
}: VoteSectionProps) {
  const isCardMode = displayMode === 'card';
  const {
    participantCount,
    myOptionIds,
    canMultiSelect,
    canRevote,
    pollStatus,
  } = voteInfo;

  const [isShareOpen, setIsShareOpen] = useState(false);

  const [mode, setMode] = useState<VoteMode>(
    hasVoted
      ? { type: 'result' }
      : { type: 'selection', selected: [] },
  );

  // 유저가 "다시 투표하기"로 의도적으로 selection으로 돌아간 경우 추적
  const isIntentionalRevoteRef = useRef(false);

  // SSR → 클라이언트 재조회 후 hasVoted가 false→true로 바뀔 때 mode 동기화
  useEffect(() => {
    if (
      hasVoted &&
      mode.type === 'selection' &&
      !isIntentionalRevoteRef.current
    ) {
      setMode({ type: 'result' });
    }
  }, [hasVoted, mode.type]);

  const { cast, change, isPending } = useVote(pollId);

  const isVotingClosed = pollStatus === 'COMPLETED';
  // hasVoted는 서버 응답 기준이라 재조회 전까지 지연될 수 있어 mode로 보완
  const isVoted = hasVoted || mode.type === 'result';
  const canRevoteNow = !isVotingClosed && isVoted && canRevote;
  const isSelecting = mode.type === 'selection';
  const selected = isSelecting ? mode.selected : [];

  const sortedOptions = [...options].sort(
    (a, b) => a.sequence - b.sequence,
  );

  const maxPercentage = Math.max(...options.map((o) => o.percentage));

  const handleOptionSelect = (optionId: number) => {
    if (!isSelecting) return;
    if (canMultiSelect) {
      setMode({
        type: 'selection',
        selected: selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId],
      });
    } else {
      setMode({ type: 'selection', selected: [optionId] });
    }
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      alert('투표할 항목을 선택해주세요.');
      return;
    }
    isIntentionalRevoteRef.current = false;
    if (hasVoted && isSelecting) {
      change(selected);
    } else {
      cast(selected);
    }
    setMode({ type: 'result' });
  };

  const handleRevote = () => {
    isIntentionalRevoteRef.current = true;
    setMode({ type: 'selection', selected: [] });
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  return (
    <>
      <section className="w-full rounded-2xl border border-neutral-50 dark:border-neutral-700 px-5 py-6">
        {/* 제목 */}
        <h2 className="text-center text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          {title}
        </h2>

        {/* 서브타이틀 */}
        <div className="flex items-center justify-center gap-1.5 mb-5 text-sm">
          <span className="">
            <span className="font-semibold text-info-700">
              {participantCount.toLocaleString()} 명
            </span>{' '}
            참여 중
          </span>
          <span className="text-neutral-400">·</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {canMultiSelect ? '중복 참여 가능' : '중복 참여 불가'}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {sortedOptions.map((option) => (
            <VoteSectionItem
              key={option.id}
              option={option}
              isSelected={
                isSelecting
                  ? selected.includes(option.id)
                  : myOptionIds.includes(option.id)
              }
              isTopOption={
                !isSelecting && maxPercentage > 0
                  ? option.percentage === maxPercentage
                  : false
              }
              mode={mode.type}
              onSelect={
                isCardMode || !isSelecting
                  ? undefined
                  : () => handleOptionSelect(option.id)
              }
            />
          ))}
        </div>

        {!isCardMode && (
          <AnimatePresence mode="wait" initial={false}>
            {mode.type === 'result' ? (
              <motion.div
                key="result-actions"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2"
              >
                <Button
                  onClick={handleShare}
                  className="flex-1 h-12 rounded-xl font-semibold text-white bg-soso-600 hover:bg-soso-600 transition-colors"
                >
                  공유하기
                </Button>
                {canRevoteNow && (
                  <button
                    onClick={handleRevote}
                    className="flex-1 h-12 rounded-xl font-semibold border border-neutral-100 text-neutral-900 dark:text-neutral-300 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                  >
                    다시 투표하기
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.button
                key="vote-button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                onClick={handleSubmit}
                disabled={selected.length === 0 || isPending}
                className={cn(
                  'w-full h-12 rounded-xl font-semibold text-white transition-colors',
                  selected.length > 0 && !isPending
                    ? 'bg-soso-600 hover:bg-soso-700'
                    : 'bg-neutral-50 text-neutral-700 dark:bg-neutral-700 cursor-not-allowed',
                )}
              >
                {isPending ? '투표 중...' : '투표하기'}
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </section>

      <VoteShareDrawer
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={title}
      />
    </>
  );
}
