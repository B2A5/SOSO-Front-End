'use client';

import { UserTypeBadge } from './UserTypeBadge';
import { MoreVertical, ThumbsUp } from 'lucide-react';
import type { Comment } from '@/types/comment.types';
import LikeButton from './LikeButton';
import BottomSheetMenu from '@/components/BottomSheet';
import { useOverlay } from '@/hooks/ui/useOverlay';
import { UserProfile } from './UserProfile';
import { UserType } from '@/types/user.types';

interface CommentItemProps {
  comment: Comment;
  action?: React.ReactNode;
}

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

  const { openOverlay } = useOverlay();

  const handleKebabClick = () => {
    const actions = [
      {
        label: '공유하기',
        onClick: () => console.log('share', comment.id),
      },
      {
        label: '수정하기',
        onClick: () => console.log('edit', comment.id),
      },
      {
        label: '삭제하기',
        onClick: () => console.log('delete', comment.id),
      },
    ];
    openOverlay(<BottomSheetMenu isOpen actions={actions} />, {
      backdrop: true,
      blockScroll: true,
      closeOnBackdrop: true,
    });
  };

  return (
    <UserProfile
      nickname={nickname}
      profileImageUrl={profileImageUrl}
      size={50}
      className="items-start"
    >
      {/* 왼쪽: 아바타 */}
      <UserProfile.Avatar className="w-[50px] h-[50px] max-w-none" />

      {/* 오른쪽: 헤더(좌/우 분리) + 본문 */}
      <UserProfile.Right className="gap-1">
        {/* 상단 줄: 왼쪽(이름/배지) · 오른쪽(액션: 맨 끝) */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <UserProfile.Name className="text-body2 font-bold" />
            <UserProfile.Badge>
              <UserTypeBadge type={userType as UserType} />
            </UserProfile.Badge>
          </div>

          <div className="shrink-0">
            {action ?? (
              <button
                type="button"
                onClick={handleKebabClick}
                aria-label="댓글 메뉴 열기"
                className="p-1 -m-1"
              >
                <MoreVertical className="w-4 h-4 text-neutral-500" />
              </button>
            )}
          </div>
        </div>

        <UserProfile.Body>
          <div className="mt-0.5 text-input text-neutral-800">
            {content}
          </div>

          <UserProfile.Meta className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <LikeButton
              isLiked={false}
              likeCount={likeCount}
              icon={ThumbsUp}
            />
            <span>
              <UserProfile.Time value={createdAt} />
            </span>
          </UserProfile.Meta>
        </UserProfile.Body>
      </UserProfile.Right>
    </UserProfile>
  );
}
