'use client';

import UserProfileBase from './UserProfileBase';
import { UserTypeBadge } from './UserTypeBadge';
import { relativeTime } from '@/utils/relativeTime';
import { MoreVertical, ThumbsUp } from 'lucide-react';
import type { Comment } from '@/types/comment.types';
import LikeButton from './LikeButton';

interface CommentItemProps {
  /** 댓글 객체 (내용, 작성자, 작성일, 좋아요 수 등 포함) */
  comment: Comment;
  /** 액션 영역 커스텀 (기본값: 케밥 메뉴) */
  action?: React.ReactNode;
}

/**
 * CommentItem 컴포넌트
 *
 * - 댓글 단일 항목을 렌더링
 * - 프로필/닉네임/유형/작성일/좋아요 수 포함
 * - 유저 정보는 UserProfileBase를 통해 표시
 */
export default function CommentItem({
  comment,
  action,
}: CommentItemProps) {
  const {
    content,
    createdAt,
    likeCount,
    user: { nickname, profileImageUrl, userType },
  } = comment;

  // 상대 시간 텍스트로 변환 (예: "2시간 전")
  const timeText = createdAt ? relativeTime(createdAt) : '';
  const metaRight = [timeText].filter(Boolean).join(' · '); // 우측 메타 표시용

  return (
    <UserProfileBase
      nickname={nickname}
      profileImageUrl={profileImageUrl}
      badge={<UserTypeBadge type={userType} />}
      avatarSize={50}
      avatarClassName="w-[50px] h-[50px] max-w-none"
      className="items-start"
      action={action ?? <MoreVertical className="w-4 h-4" />} // 기본 케밥 메뉴
    >
      {/* 댓글 내용 */}
      <div className="mt-0.5">{content}</div>

      {/* 메타 정보 (좋아요 수 / 작성 시간 등) */}
      <div className="mt-2 flex justify-between text-xs text-neutral-500">
        <LikeButton
          isLiked={false}
          likeCount={likeCount}
          icon={ThumbsUp}
        />
        <span>{metaRight}</span>
      </div>
    </UserProfileBase>
  );
}
