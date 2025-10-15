'use client';

// import { UserTypeBadge } from './UserTypeBadge';
import { MoreVertical, ThumbsUp } from 'lucide-react';
import type { FreeboardCommentSummary } from '@/generated/api/models';
import LikeButton from './LikeButton';
import BottomSheetMenu from '@/components/BottomSheet';
import { useOverlay } from '@/hooks/ui/useOverlay';
import { UserProfile } from './UserProfile';
import { relativeTime } from '@/utils/relativeTime';

interface CommentItemProps {
  comment: FreeboardCommentSummary;
}

/**
 * 댓글 아이템
 * @todo 백엔드에서 댓글 작성자의 userType 필드 추가 예정 (현재 없음)
 */
export default function CommentItem({ comment }: CommentItemProps) {
  const {
    author,
    content,
    createdAt,
    likeCount,
    isLiked,
    commentId,
  } = comment;
  const { nickname, profileImageUrl /* userType */ } = author ?? {};

  const { openOverlay } = useOverlay();

  const handleKebabClick = () => {
    const actions = [
      {
        label: '공유하기',
        onClick: () => console.log('share', commentId),
      },
      {
        label: '수정하기',
        onClick: () => console.log('edit', commentId),
      },
      {
        label: '삭제하기',
        onClick: () => console.log('delete', commentId),
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
          alt={`${nickname ?? '사용자'}의 프로필`}
        />
      </UserProfile.Left>

      <UserProfile.Right className="gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <UserProfile.Name
              nickname={nickname ?? '익명'}
              // @todo userType은 현재 CommentAuthorInfo에 없음 → 백엔드 확장 필요
              // userType={userType && <UserTypeBadge type={userType} />}
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
          <div className="text-input text-neutral-800">
            {comment.deleted ? '삭제된 댓글입니다.' : content}
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <LikeButton
              postId={commentId ?? 0}
              isLiked={isLiked ?? false}
              likeCount={likeCount ?? 0}
              icon={ThumbsUp}
            />
            <span>{relativeTime(createdAt ?? '')}</span>
          </div>
        </UserProfile.SubContents>
      </UserProfile.Right>
    </UserProfile>
  );
}
