import Card from '@/components/Card';
import { CategoryBadge } from './CategoryBadge';
import { Category } from '@/constants/categorys';

import { relativeTime } from '@/utils/relativeTime';
import { Heart, MessageSquareMore } from 'lucide-react';
export interface CommunityCardProps {
  title: string; // 제목
  description: string; // 콘텐츠 내용
  likeCount: number; //좋아요 수
  isLiked: boolean; // 내가 좋아요를 눌렀는지 여부
  commentCount: number; // 댓글 수
  isCommented: boolean; // 내가 댓글을 남겼는지 여부
  createdAt: string; // 생성일
  userName: string; // 작성자 이름
  category: Category; // 카테고리
  isBadge?: boolean; // 배지 표시 여부
}

export function CommunityCard(props: CommunityCardProps) {
  return (
    <Card className="w-full max-w-[316px]">
      <div className="flex flex-col items-center gap-3">
        {props.isBadge && (
          <div className="flex items-center gap-1">
            <CategoryBadge category={props.category} />
          </div>
        )}
        <h3 className="text-title2">{props.title}</h3>
        <p className="text-body">{props.description}</p>
      </div>
      <div className="flex justify-between items-center ">
        {/* 날짜 및 이름 */}
        <label className="text-neutral-500 text-xs">
          {props.userName} · {relativeTime(props.createdAt)}
        </label>
        {/* 오른쪽 라벨 */}
        <div className="flex items-center gap-2">
          {/* 좋아요 수 */}
          <div className="flex items-center gap-1">
            <Heart
              className={`w-4 h-4 ${props.isLiked ? 'text-red-500' : 'text-neutral-500'}`}
            />
            <span className="text-xs">{props.likeCount}</span>
          </div>
          {/* 댓글 수 */}
          <div className="flex items-center gap-1">
            <MessageSquareMore className="w-4 h-4 text-neutral-500" />
            <span className="text-xs">{props.commentCount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
