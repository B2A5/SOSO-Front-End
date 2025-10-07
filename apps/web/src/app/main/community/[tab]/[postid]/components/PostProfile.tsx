'use client';

import UserProfileBase from './UserProfileBase';
import { UserTypeBadge } from './UserTypeBadge';
import { relativeTime } from '@/utils/relativeTime';
import { UserType } from '@/types/user.types';

interface PostProfileProps {
  /** 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL */
  profileImageUrl?: string;
  /** 사용자 유형(창업자/주민) */
  userType: UserType;
  /** 위치(예: '서울시 강남구') */
  location?: string;
  /** 작성 시간(ISO 문자열 등) */
  createdAt?: string;
  /** 본문 설명 등 추가 영역 */
  children?: React.ReactNode;
}

/**
 * 게시글 상단용 프로필 행.
 * - 메타: `location · time`
 * - 아바타 크기: 45px
 */
export default function PostProfile({
  nickname,
  profileImageUrl,
  userType,
  location,
  createdAt,
  children,
}: PostProfileProps) {
  const timeText = createdAt ? relativeTime(createdAt) : '';
  const meta = [location, timeText].filter(Boolean).join(' · ');

  return (
    <UserProfileBase
      nickname={nickname}
      profileImageUrl={profileImageUrl}
      badge={<UserTypeBadge type={userType} />}
      avatarSize={45}
      // 전역 img 규칙(height:auto/max-width) 차단: 클래스로 고정
      avatarClassName="w-[45px] h-[45px] max-w-none"
      className="items-center"
    >
      {children && <div className="mt-0.5">{children}</div>}
      {meta && (
        <p className="mt-1.5 text-input2 text-neutral-500">{meta}</p>
      )}
    </UserProfileBase>
  );
}
