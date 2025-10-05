import { Home, Sprout } from 'lucide-react';
import { UserType } from '@/types/user.types';

/**
 * 사용자 유형 배지(창업자/주민).
 * - 기본 색상: bg-soso-600 text-white
 * - 패딩: 가로 8(px-2), 세로 4(py-1), gap 2(gap-0.5)
 * - 아이콘은 시각 보조, 스크린리더는 라벨만 읽음
 */
export function UserTypeBadge({
  type,
  withIcon = true,
  className = '',
}: {
  /** 배지에 표시할 사용자 역할 */
  type: UserType;
  /** 아이콘 표시 여부 (기본 true) */
  withIcon?: boolean;
  /** 추가 Tailwind 클래스 */
  className?: string;
}) {
  const userTypeMap = {
    FOUNDER: { label: '창업자', Icon: Sprout },
    INHABITANT: { label: '주민', Icon: Home },
  } as const;

  const { label, Icon } = userTypeMap[type];

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full bg-soso-600 px-1 py-0.5 text-[8px] text-white ${className}`}
      aria-label={label}
    >
      {label}
      {withIcon && Icon ? (
        <Icon className="h-3 w-3" aria-hidden="true" />
      ) : null}
    </span>
  );
}
