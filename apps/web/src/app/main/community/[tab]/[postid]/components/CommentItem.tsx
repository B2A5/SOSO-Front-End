'use client';

import { UserTypeBadge } from './UserTypeBadge';
import { MoreVertical, ThumbsUp } from 'lucide-react';
import type { Comment } from '@/types/comment.types';
import LikeButton from './LikeButton';
import BottomSheetMenu from '@/components/BottomSheet';
import { useOverlay } from '@/hooks/ui/useOverlay';
import { UserProfile } from './UserProfile';
import { UserType } from '@/types/user.types';
import { relativeTime } from '@/utils/relativeTime';

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
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
    <UserProfile className="items-start">
      <UserProfile.Left>
        <UserProfile.Avatar
          url={profileImageUrl}
          size={50}
          alt={`${nickname}의 프로필`}
        />
      </UserProfile.Left>

      <UserProfile.Right className="gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <UserProfile.Name
              nickname={nickname}
              userType={<UserTypeBadge type={userType as UserType} />}
              nicknameClassName="text-body2 font-medium"
            />
          </div>

          <button
            type="button"
            onClick={handleKebabClick}
            aria-label="댓글 메뉴 열기"
            className="p-1 -m-1"
          >
            <MoreVertical className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        <UserProfile.SubContents>
          <div className="text-input text-neutral-800">{content}</div>

          <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <LikeButton
              isLiked={false}
              likeCount={likeCount}
              icon={ThumbsUp}
            />
            <span>{relativeTime(createdAt)}</span>
          </div>
        </UserProfile.SubContents>
      </UserProfile.Right>
    </UserProfile>
  );
}
