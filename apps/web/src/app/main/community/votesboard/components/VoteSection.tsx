'use client';

import { useState } from 'react';
import type {
  VoteInfo,
  PollOptionResponse,
} from '@/generated/api/models';
import { useVote } from '@/app/main/community/votesboard/hooks/useVote.mutate';
import { cn } from '@/utils/cn';
import { VoteSectionItem } from './VoteSectionItem';

interface VoteSectionProps {
  pollId: number;
  title: string;
  voteInfo: VoteInfo;
  options: PollOptionResponse[];
  hasVoted: boolean;
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
}: VoteSectionProps) {
  const {
    participantCount,
    myOptionIds,
    canMultiSelect,
    canRevote,
    pollStatus,
  } = voteInfo;

  const [mode, setMode] = useState<VoteMode>(
    hasVoted
      ? { type: 'result' }
      : { type: 'selection', selected: [] },
  );

  const { cast, change, isPending } = useVote(pollId);

  const isVotingClosed = pollStatus === 'COMPLETED';
  const canRevoteNow = !isVotingClosed && hasVoted && canRevote;
  const isSelecting = mode.type === 'selection';
  const selected = isSelecting ? mode.selected : [];

  const sortedOptions = [...options].sort(
    (a, b) => a.sequence - b.sequence,
  );

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
    if (hasVoted && isSelecting) {
      change(selected);
    } else {
      cast(selected);
    }
    setMode({ type: 'result' });
  };

  const handleRevote = () => {
    setMode({ type: 'selection', selected: [] });
  };

  const handleShare = () => {
    alert('공유 기능 준비 중입니다.');
  };

  return (
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
            mode={mode.type}
            onSelect={
              isSelecting
                ? () => handleOptionSelect(option.id)
                : undefined
            }
          />
        ))}
      </div>

      {mode.type === 'result' ? (
        canRevoteNow && (
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex-1 h-12 rounded-xl font-semibold text-white bg-soso-500 hover:bg-soso-600 transition-colors"
            >
              공유하기
            </button>
            <button
              onClick={handleRevote}
              className="flex-1 h-12 rounded-xl font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
            >
              다시 투표하기
            </button>
          </div>
        )
      ) : (
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0 || isPending}
          className={cn(
            'w-full h-12 rounded-xl font-semibold text-white transition-colors',
            selected.length > 0 && !isPending
              ? 'bg-soso-500 hover:bg-soso-600'
              : 'bg-neutral-300 dark:bg-neutral-700 cursor-not-allowed',
          )}
        >
          {isPending ? '투표 중...' : '투표하기'}
        </button>
      )}
    </section>
  );
}
