import { VotePostSummaryResponseVoteStatus } from '@/generated/api/models/votePostSummaryResponseVoteStatus';
import { twMerge } from 'tailwind-merge';

/**
 * 투표 상태 칩 타입
 * - in-progress: 진행 중
 * - deadline-soon: 마감 임박
 * - closed: 마감
 * - completed: 완료
 */
export type VoteChipType =
  | 'in-progress'
  | 'deadline-soon'
  | 'closed'
  | 'completed';

// 투표 상태 컬러
const VOTE_STATUS_COLORS: Record<VoteChipType, string> = {
  'in-progress': 'bg-blue-100 text-blue-800',
  'deadline-soon': 'bg-orange-100 text-orange-800',
  closed: 'bg-gray-100 text-gray-800',
  completed: 'bg-green-100 text-green-800',
};

// 투표 상태 라벨
const VOTE_STATUS_LABELS: Record<VoteChipType, string> = {
  'in-progress': '진행 중',
  'deadline-soon': '마감 임박',
  closed: '마감',
  completed: '완료',
};

/**
 * 투표 상태 타입 반환
 */
export function getVoteChipType(
  voteStatus: VotePostSummaryResponseVoteStatus,
  endTime: string,
): VoteChipType {
  if (
    voteStatus === VotePostSummaryResponseVoteStatus.COMPLETED ||
    voteStatus === VotePostSummaryResponseVoteStatus.DELETED
  ) {
    return 'completed';
  }

  if (voteStatus === VotePostSummaryResponseVoteStatus.IN_PROGRESS) {
    const now = new Date();
    const endDate = new Date(endTime);

    // 투표 마감 시간 비교
    if (endDate <= now) {
      return 'closed';
    }

    // 24시간 이내 마감 임박 (마감 임박)
    const hoursUntilDeadline =
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilDeadline <= 24) {
      return 'deadline-soon';
    }

    // 진행 중
    return 'in-progress';
  }

  // 기본값
  return 'in-progress';
}

/**
 * 투표 상태 라벨 반환
 */
export function getVoteChipLabel(statusType: VoteChipType): string {
  return VOTE_STATUS_LABELS[statusType];
}

/**
 * 투표 상태 색상 반환
 */
export function getVoteChipColor(statusType: VoteChipType): string {
  return VOTE_STATUS_COLORS[statusType];
}

interface VoteStatusChipProps {
  voteStatus: VotePostSummaryResponseVoteStatus;
  endTime: string;
}

export function VoteStatusChip({
  voteStatus,
  endTime,
}: VoteStatusChipProps) {
  const statusType = getVoteChipType(voteStatus, endTime);

  return (
    <span
      className={twMerge(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getVoteChipColor(statusType),
      )}
    >
      {getVoteChipLabel(statusType)}
    </span>
  );
}
