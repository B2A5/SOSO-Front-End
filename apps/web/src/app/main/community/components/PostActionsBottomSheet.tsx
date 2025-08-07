'use client';

import React from 'react';
import BottomSheetMenu, {
  MenuAction,
} from '@/components/BottomSheet';

interface PostActionsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isMyPost: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onFollowUser?: () => void;
}

export default function PostActionsBottomSheet({
  isOpen,
  isMyPost,
  onEdit,
  onDelete,
  onReport,
  onShare,
  onBookmark,
  onFollowUser,
}: PostActionsBottomSheetProps) {
  const getActions = (): MenuAction[] => {
    const commonActions: MenuAction[] = [];

    // 공유 기능
    if (onShare) {
      commonActions.push({
        label: '공유하기',
        onClick: onShare,
      });
    }

    // 북마크 기능
    if (onBookmark) {
      commonActions.push({
        label: '저장하기',
        onClick: onBookmark,
      });
    }

    // 내 게시글인 경우
    if (isMyPost) {
      if (onEdit) {
        commonActions.push({
          label: '수정하기',
          onClick: onEdit,
        });
      }

      if (onDelete) {
        commonActions.push({
          label: '삭제하기',
          onClick: onDelete,
          destructive: true,
        });
      }
    } else {
      // 다른 사람 게시글인 경우
      if (onFollowUser) {
        commonActions.push({
          label: '팔로우하기',
          onClick: onFollowUser,
        });
      }

      if (onReport) {
        commonActions.push({
          label: '신고하기',
          onClick: onReport,
          destructive: true,
        });
      }
    }

    return commonActions;
  };

  return <BottomSheetMenu isOpen={isOpen} actions={getActions()} />;
}
