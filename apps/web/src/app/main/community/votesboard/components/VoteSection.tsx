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
  voteInfo: VoteInfo;
  options: PollOptionResponse[];
  hasVoted: boolean;
}

export function VoteSection({
  pollId,
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

  const [selectedOptions, setSelectedOptions] =
    useState<number[]>(myOptionIds);
  const [showResults, setShowResults] = useState(hasVoted === true);

  const { cast, change, isPending } = useVote(pollId);

  // 파생 상태
  const isVotingClosed = pollStatus === 'COMPLETED';
  const canRevoteNow =
    !isVotingClosed && hasVoted === true && canRevote;

  // 옵션 선택 핸들러
  const handleOptionSelect = (optionId: number) => {
    if (canMultiSelect) {
      setSelectedOptions((prev) => {
        if (prev.includes(optionId)) {
          return prev.filter((id) => id !== optionId);
        } else {
          return [...prev, optionId];
        }
      });
    } else {
      setSelectedOptions([optionId]);
    }
  };

  // 투표/재투표 제출
  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      alert('투표할 항목을 선택해주세요.');
      return;
    }

    // 재투표 상황 디버깅
    console.log('[VoteSection] 디버그 - 투표 참여 여부:', hasVoted);
    console.log(
      '[VoteSection] 디버그 - 결과 표시 여부:',
      showResults,
    );
    console.log(
      '[VoteSection] 디버그 - 서버에서 받은 선택 옵션:',
      myOptionIds,
    );
    console.log(
      '[VoteSection] 디버그 - 현재 선택된 옵션:',
      selectedOptions,
    );

    // 재투표 상황: hasVoted=true이면서 showResults=false (재투표 버튼을 눌렀을 때)
    const isRevoting = hasVoted === true && !showResults;
    console.log(
      '[VoteSection] 디버그 - 재투표 모드 여부:',
      isRevoting,
    );

    if (isRevoting) {
      console.log('[VoteSection] 재투표 API 호출 (PUT)');
      change(selectedOptions); // 재투표 - PUT
    } else {
      console.log('[VoteSection] 첫 투표 API 호출 (POST)');
      cast(selectedOptions); // 첫 투표 - POST
    }

    setShowResults(true);
  };

  // 재투표 시작
  const handleRevote = () => {
    console.log('[VoteSection] 재투표 버튼 클릭');
    console.log(
      '[VoteSection] 변경 전 - 결과 표시 여부:',
      showResults,
    );
    setShowResults(false);
    setSelectedOptions([]);
    console.log(
      '[VoteSection] 변경 후 - 다음 렌더링에서 결과 표시가 false가 됩니다',
    );
  };

  // 공유하기
  const handleShare = () => {
    alert('공유 기능 준비 중입니다.');
  };

  // 정렬: sequence 순으로 통일
  const sortedOptions = [...options].sort(
    (a, b) => a.sequence - b.sequence,
  );

  // 옵션 선택 여부 확인
  const getIsSelected = (optionId: number): boolean => {
    if (showResults) {
      return myOptionIds.includes(optionId);
    } else {
      return selectedOptions.includes(optionId);
    }
  };

  // 투표 모드 결정
  const getVoteMode = (): 'result' | 'selection' => {
    if (showResults) {
      return 'result';
    } else {
      return 'selection';
    }
  };

  // 옵션 선택 핸들러 결정
  const getOptionSelectHandler = (
    optionId: number,
  ): (() => void) | undefined => {
    if (showResults) {
      return undefined;
    } else {
      return () => handleOptionSelect(optionId);
    }
  };

  // 버튼 스타일 계산
  const getButtonClassName = (): string => {
    const baseClass =
      'w-full h-12 rounded-xl font-semibold text-white transition-colors';

    if (selectedOptions.length > 0 && !isPending) {
      return cn(baseClass, 'bg-soso-500 hover:bg-soso-600');
    } else {
      return cn(
        baseClass,
        'bg-neutral-300 dark:bg-neutral-700 cursor-not-allowed',
      );
    }
  };

  // 버튼 텍스트 결정
  const getButtonText = (): string => {
    if (isPending) {
      return '투표 중...';
    } else {
      return '투표하기';
    }
  };

  // 헤더 텍스트 생성
  const getHeaderText = (): string => {
    const participantText = `${participantCount.toLocaleString()}명 참여 중`;

    if (!canMultiSelect && !showResults) {
      return `${participantText} · 중복 참여 불가`;
    } else {
      return participantText;
    }
  };

  // 버튼 영역 렌더링
  const renderButtonSection = () => {
    if (showResults) {
      // 투표 완료: 공유하기 + 재투표 버튼
      if (canRevoteNow) {
        return (
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
              재투표
            </button>
          </div>
        );
      }
      return null;
    } else {
      // 투표 전: 투표하기 버튼
      return (
        <button
          onClick={handleSubmit}
          disabled={selectedOptions.length === 0 || isPending}
          className={getButtonClassName()}
        >
          {getButtonText()}
        </button>
      );
    }
  };

  return (
    <section className="w-full px-4 py-6">
      {/* 헤더 */}
      <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
        {getHeaderText()}
      </div>

      {/* 투표 옵션 리스트 */}
      <div className="space-y-2 mb-4">
        {sortedOptions.map((option) => (
          <VoteSectionItem
            key={option.id}
            option={option}
            isSelected={getIsSelected(option.id)}
            mode={getVoteMode()}
            onSelect={getOptionSelectHandler(option.id)}
          />
        ))}
      </div>

      {/* 버튼 영역 */}
      {renderButtonSection()}
    </section>
  );
}
