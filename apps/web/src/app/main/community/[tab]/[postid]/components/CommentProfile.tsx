'use client';

import UserProfileBase from './UserProfileBase';
import { UserTypeBadge } from './UserTypeBadge';
import { relativeTime } from '@/utils/relativeTime';

interface CommentProfileProps {
  /** 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL */
  profileImageUrl?: string;
  /** 사용자 유형(창업자/주민) */
  userType: 'founder' | 'resident';
  /** 댓글 좋아요 수 */
  likeCount?: number;
  /** 수정됨 여부 */
  edited?: boolean;
  /** 작성 시간(ISO 문자열 등) */
  createdAt?: string;
  /** 우측 상단 액션 버튼 */
  action?: React.ReactNode;
  /** 댓글 본문 */
  children?: React.ReactNode;
}

/**
 * 댓글용 프로필 행.
 * - 메타: `좋아요 N` (좌) / `time · 수정됨` (우)
 * - 아바타 크기: 50px
 */
export default function CommentProfile({
  nickname,
  profileImageUrl,
  userType,
  likeCount,
  edited,
  createdAt,
  action,
  children,
}: CommentProfileProps) {
  const timeText = createdAt ? relativeTime(createdAt) : '';
  const rightMeta = [timeText, edited ? '수정됨' : '']
    .filter(Boolean)
    .join(' · ');
  const hasLeft = likeCount !== undefined;
  const hasRight = Boolean(rightMeta);
  const justify =
    hasLeft && hasRight
      ? 'justify-between'
      : hasRight
        ? 'justify-end'
        : 'justify-start';

  return (
    <UserProfileBase
      nickname={nickname}
      profileImageUrl={profileImageUrl}
      badge={<UserTypeBadge type={userType} />}
      avatarSize={50}
      // 전역 img 규칙(height:auto/max-width) 차단: 클래스로 고정
      avatarClassName="w-[50px] h-[50px] max-w-none"
      className="items-start"
      action={action}
    >
      {children && <div className="mt-0.5">{children}</div>}
      {(hasLeft || hasRight) && (
        <p
          className={`mt-2 flex items-center text-xs text-neutral-500 ${justify}`}
        >
          {hasLeft && <span>좋아요 {likeCount}</span>}
          {hasRight && <span>{rightMeta}</span>}
        </p>
      )}
    </UserProfileBase>
  );
}
