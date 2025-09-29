'use client';

import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

/**
 * 사용자 프로필의 공통 골격 컴포넌트.
 * - 좌측 아바타 + 우측 닉네임/뱃지/액션 + 본문(children) 레이아웃을 제공
 * - 화면별(게시글/댓글 등) 특화 영역은 children으로 구성
 */
export interface UserProfileBaseProps {
  /** 닉네임(16px 고정 텍스트로 표시) */
  nickname: string;
  /** 프로필 이미지 URL (없으면 기본 이미지로 대체) */
  profileImageUrl?: string;
  /** 사용자 유형 등 뱃지 영역(외부에서 조립해 전달) */
  badge: React.ReactNode;
  /** 아바타 기본 크기(px). width/height 속성에 사용. @default 45 */
  avatarSize?: number;
  /** 아바타에 Tailwind 클래스를 추가로 적용 (예: 'w-[45px] h-[45px] max-w-none') */
  avatarClassName?: string;
  /** 최상위 컨테이너 클래스명 (정렬/간격 커스터마이즈용) */
  className?: string;
  /** 우측 상단 액션 슬롯(케밥 메뉴 등) */
  action?: React.ReactNode;
  /** 본문/메타 등 가변 영역(화면별 자유 구성) */
  children?: React.ReactNode;
}

/**
 * 프로필 공용 베이스 컴포넌트.
 * - 아바타 오류 시 기본 이미지로 대체
 * - 전역 img 스타일의 영향은 avatarClassName으로 차단 가능(max-w-none 등)
 */
export default function UserProfileBase({
  nickname,
  profileImageUrl,
  badge,
  avatarSize = 45,
  avatarClassName,
  className,
  action,
  children,
}: UserProfileBaseProps) {
  const src = profileImageUrl || '/somoon/default_somoon.svg';

  return (
    <div
      className={twMerge('flex items-center gap-[10px]', className)}
    >
      <Image
        src={src}
        alt={`${nickname}의 프로필 이미지`}
        width={avatarSize}
        height={avatarSize}
        className={twMerge(
          // 아바타 기본 스타일
          'rounded-full object-cover bg-neutral-50 p-1 shrink-0',
          // 전역 img { max-width:100%; height:auto } 대응용: 필요시 여기로 전달
          avatarClassName,
        )}
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (!img.src.endsWith('/somoon/default_somoon.svg')) {
            img.src = '/somoon/default_somoon.svg';
          }
        }}
      />

      <div className="flex-1 min-w-0">
        {/* 상단: 닉네임(16px 고정) + 뱃지 + 액션 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-base font-bold">
              {nickname}
            </span>
            {badge}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        {/* 본문/메타: 화면별로 자유 구성 */}
        {children}
      </div>
    </div>
  );
}
