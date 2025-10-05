/**
 * 탭 value 타입
 */

export type InitialTabValue = 'all';
export type CommunityTabValue = 'votesboard' | 'freeboard';

export interface TabItem<T = string> {
  title: string;
  value: T;
}
