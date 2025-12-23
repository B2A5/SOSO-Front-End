import { GetVotePostListStatus } from '@/generated/api/models';
import { TabItem } from '@/types/tab.types';

export type VoteState = GetVotePostListStatus | null;

export const VOTE_STATES: TabItem<VoteState>[] = [
  { label: '진행중', value: 'IN_PROGRESS' },
  { label: '완료', value: 'COMPLETED' },
];
