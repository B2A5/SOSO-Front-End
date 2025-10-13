'use client';

import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';

/** UserProfile 루트 */
interface UserProfileRootProps {
  className?: string;
  children?: React.ReactNode;
}

function UserProfileRoot({
  className,
  children,
}: UserProfileRootProps) {
  return (
    <div
      className={twMerge('flex items-center gap-3 w-full', className)}
    >
      {children}
    </div>
  );
}

/** 왼쪽 영역: 주로 아바타 배치 */
interface LeftProps {
  className?: string;
  children?: React.ReactNode;
}

function Left({ className, children }: LeftProps) {
  return (
    <div className={twMerge('shrink-0', className)}>{children}</div>
  );
}

/** 아바타 이미지 */
interface AvatarProps {
  /** 프로필 사진 경로 */
  url?: string;
  /** 대체 텍스트 */
  alt?: string;
  /** 크기(px), 기본 45 */
  size?: number;
  className?: string;
}

function Avatar({
  url,
  alt = '프로필 이미지',
  size = 45,
  className,
}: AvatarProps) {
  const DEFAULT_AVATAR = '/somoon/default_somoon.svg';
  const src = url || DEFAULT_AVATAR;

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const img = e.currentTarget;
    if (!img.src.endsWith(DEFAULT_AVATAR)) {
      img.src = DEFAULT_AVATAR;
    }
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={twMerge(
        `rounded-full object-cover bg-neutral-50 p-1 shrink-0 max-w-none h-[${size}px]`,
        className,
      )}
      onError={handleImageError}
    />
  );
}

/** 오른쪽 영역: 이름, 내용 등 */
interface RightProps {
  className?: string;
  children?: React.ReactNode;
}

function Right({ className, children }: RightProps) {
  return (
    <div className={twMerge('flex-1 flex flex-col', className)}>
      {children}
    </div>
  );
}

/** 이름 + 사용자 유형 표시 */
interface NameProps {
  nickname: string;
  /** 사용자 유형(뱃지 등) */
  userType?: React.ReactNode;
  /** 닉네임 전용 클래스 */
  nicknameClassName?: string;
  /** 전체 wrapper 클래스 */
  className?: string;
}

function Name({
  nickname,
  userType,
  className,
  nicknameClassName,
}: NameProps) {
  return (
    <div className={twMerge('flex items-center gap-2', className)}>
      <span className={twMerge('text-title2', nicknameClassName)}>
        {nickname}
      </span>
      {userType && <span className="leading-none">{userType}</span>}
    </div>
  );
}

/** 하위 내용 영역: 주소/작성시간/댓글 등 */
interface SubContentsProps {
  className?: string;
  children?: React.ReactNode;
}

function SubContents({ className, children }: SubContentsProps) {
  return (
    <div className={twMerge('flex flex-col gap-1', className)}>
      {children}
    </div>
  );
}

/** 합성 컴포넌트 객체로 내보내기 */
const UserProfile = Object.assign(UserProfileRoot, {
  Left,
  Right,
  Avatar,
  Name,
  SubContents,
});

export { UserProfile };
