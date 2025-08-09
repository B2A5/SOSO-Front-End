'use client';

/**
 * UserProfile
 * - post/comment 공용 프로필 컴포넌트
 */
import Image from 'next/image';
import { Home, Sprout } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { relativeTime } from '@/utils/relativeTime';

type UserType = 'founder' | 'resident';
type Variant = 'post' | 'comment';

export interface UserProfileProps {
  nickname: string;
  profileImageUrl?: string;
  userType: UserType;
  createdAt?: string;
  location?: string;

  // comment 전용
  likeCount?: number;
  edited?: boolean;

  variant?: Variant;
  className?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export default function UserProfile({
  nickname,
  profileImageUrl,
  userType,
  createdAt,
  location,
  likeCount,
  edited,
  variant = 'post',
  className,
  action,
  children,
}: UserProfileProps) {
  // 크기/정렬
  const isComment = variant === 'comment';
  const avatar = isComment ? 50 : 45;

  // 메타 텍스트
  const timeText = createdAt ? relativeTime(createdAt) : '';
  const postMeta = [location, timeText].filter(Boolean).join(' · ');
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

  // 이미지 폴백
  const src = profileImageUrl || '/somoon/default_somoon.svg';

  return (
    <div
      className={twMerge(
        'flex gap-[10px]',
        isComment ? 'items-start' : 'items-center',
        className,
      )}
    >
      <Image
        src={src}
        alt={`${nickname}의 프로필 이미지`}
        width={avatar}
        height={avatar}
        sizes={`${avatar}px`}
        className={twMerge(
          'rounded-full object-cover bg-neutral-50 p-1 shrink-0',
          `w-[${avatar}px] h-[${avatar}px]`,
        )}
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (!img.src.endsWith('/somoon/default_somoon.svg'))
            img.src = '/somoon/default_somoon.svg';
        }}
      />

      <div className="flex-1 min-w-0">
        {/* 상단: 닉네임/뱃지/액션 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base font-bold truncate">
              {nickname}
            </span>
            <span className="text-[8px] px-1 py-0.5 rounded-full text-white bg-soso-600 inline-flex items-center gap-0.5">
              {userType === 'founder' ? (
                <>
                  창업자{' '}
                  <Sprout className="w-2 h-2" aria-hidden="true" />
                </>
              ) : (
                <>
                  주민 <Home className="w-2 h-2" aria-hidden="true" />
                </>
              )}
            </span>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        {/* 본문 슬롯 */}
        {children && <div className="mt-0.5">{children}</div>}

        {/* 메타 */}
        {variant === 'post' ? (
          postMeta && (
            <p className="text-input2 text-neutral-500 mt-1.5">
              {postMeta}
            </p>
          )
        ) : hasLeft || hasRight ? (
          <p
            className={twMerge(
              'text-xs text-neutral-500 mt-2 flex items-center',
              justify,
            )}
          >
            {hasLeft && <span>좋아요 {likeCount}</span>}
            {hasRight && <span>{rightMeta}</span>}
          </p>
        ) : null}
      </div>
    </div>
  );
}
