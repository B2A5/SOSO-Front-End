'use client';

import { relativeTime } from '@/utils/relativeTime';
import Image from 'next/image';
import React, { createContext, useContext, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * UserProfile 슬롯들이 공유하는 값
 * nickname/profileImageUrl/size 를 한 번만 공급
 * 하위 슬롯은 props 드릴링 없이 useContext로 접근
 */
type ProfileCtxValue = {
  nickname: string;
  profileImageUrl?: string;
  /** 아바타 크기(px) */
  size: number;
};

const DEFAULT_AVATAR = '/somoon/default_somoon.svg';

/** UserProfile 전용 Context (루트 내부에서만 사용 가능) */
const ProfileCtx = createContext<ProfileCtxValue | null>(null);

/**
 * UserProfile Context 접근 훅
 * 루트 밖에서 사용 시 즉시 에러 던짐
 */
function useProfileCtx() {
  const context = useContext(ProfileCtx);
  if (!context) {
    throw new Error(
      'UserProfile.*는 반드시 <UserProfile> 내부에서 사용하세요.',
    );
  }
  return context;
}

/**
 * UserProfile 루트(Provider)
 * 공통 값(nickname, profileImageUrl, size)을 Context로 공급하고
 * 자식 슬롯(Avatar/Name/Meta 등)을 조합해 UI를 구성
 */
type UserProfileRootProps = {
  nickname: string;
  profileImageUrl?: string;
  /** 아바타 크기(px). 기본 45 */
  size?: number;
  className?: string;
  children?: React.ReactNode;
};

function UserProfileRoot({
  nickname,
  profileImageUrl,
  size = 45,
  className,
  children,
}: UserProfileRootProps) {
  // value를 안정화하여 하위 슬롯의 불필요한 리렌더를 줄임
  const value = useMemo(
    () => ({ nickname, profileImageUrl, size }),
    [nickname, profileImageUrl, size],
  );

  return (
    <ProfileCtx.Provider value={value}>
      <div
        className={twMerge('flex items-center gap-[10px]', className)}
      >
        {children}
      </div>
    </ProfileCtx.Provider>
  );
}

/**
 * 아바타 이미지 슬롯
 * - 로딩/에러 시 기본 이미지로 폴백
 * - 전역 img 규칙 영향 방지를 위해 max-w-none 포함
 */
function Avatar({ className }: { className?: string }) {
  const { nickname, profileImageUrl, size } = useProfileCtx();
  const src = profileImageUrl || DEFAULT_AVATAR;

  return (
    <Image
      src={src}
      alt={`${nickname}의 프로필 이미지`}
      width={size}
      height={size}
      className={twMerge(
        'rounded-full object-cover bg-neutral-50 p-1 shrink-0 w-[45px] h-[45px] max-w-none',
        className,
      )}
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        if (!img.src.endsWith(DEFAULT_AVATAR))
          img.src = DEFAULT_AVATAR;
      }}
    />
  );
}

/**
 * 상단 행 컨테이너
 */
function Header({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={twMerge('flex-1 min-w-0', className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * 닉네임 텍스트
 */
function Name({
  truncate = true,
  className,
}: {
  /** 말줄임 적용 여부 (기본 true) */
  truncate?: boolean;
  className?: string;
}) {
  const { nickname } = useProfileCtx();
  return (
    <span
      className={twMerge(
        'text-base font-bold',
        truncate && 'truncate',
        className,
      )}
      title={truncate ? nickname : undefined}
    >
      {nickname}
    </span>
  );
}

/**
 * 배지 영역
 * 외부에서 전달된 배지 UI를 그대로 렌더(없으면 렌더 X)
 */
function Badge({ children }: { children?: React.ReactNode }) {
  return children ? <>{children}</> : null;
}

/**
 * 우측 액션 영역
 * 내부 버튼에 접근성 속성 사용 권장
 */
function Action({ children }: { children?: React.ReactNode }) {
  return children ? <div className="shrink-0">{children}</div> : null;
}

/**
 * 본문 컨테이너
 * 화면별로 특화된 children을 배치
 */
function Body({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={twMerge('flex-1 min-w-0', className)}>
      {children}
    </div>
  );
}

/**
 * 보조 텍스트(메타) 라인
 * 위치/시간 등을 한 줄로 표시할 때 사용
 */
function Meta({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <p
      className={twMerge(
        'mt-1.5 text-input-2 text-neutral-500',
        className,
      )}
    >
      {children}
    </p>
  );
}

/** 메타 구분자 · (중간 점) */
Meta.Separator = function Separator() {
  return <span className="mx-1">·</span>;
};

/** 위치 텍스트(값 없으면 렌더 X) */
function Location({ value }: { value?: string }) {
  return value ? <span>{value}</span> : null;
}

/** 상대시간 텍스트(값 없으면 렌더 X) */
function Time({ value }: { value?: string }) {
  if (!value) return null;
  return <span>{relativeTime(value)}</span>;
}

/** 오른쪽 영역 컨테이너: Header와 Body를 세로로 묶어 배치 */
function Right({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={twMerge(
        'flex-1 min-w-0 flex flex-col gap-1',
        className,
      )}
    >
      {children}
    </div>
  );
}

const UserProfile = Object.assign(UserProfileRoot, {
  Avatar,
  Header,
  Name,
  Badge,
  Action,
  Body,
  Meta,
  Location,
  Time,
  Right,
});

export { UserProfile };
