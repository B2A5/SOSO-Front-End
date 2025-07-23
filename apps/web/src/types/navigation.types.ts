// apps/web/src/types/navigation.ts
import {
  MessagesSquare,
  MapPin,
  Sprout,
  CircleUser,
} from 'lucide-react';

/**
 * 네비게이션 아이템 인터페이스
 */
export interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * 네비게이션 아이템 목록
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: '/main/community',
    label: '커뮤니티',
    icon: MessagesSquare,
  },
  {
    href: '/main/founder',
    label: '창업 도우미',
    icon: Sprout,
  },
  {
    href: '/main/maps',
    label: '지도',
    icon: MapPin,
  },
  {
    href: '/main/profile',
    label: '마이페이지',
    icon: CircleUser,
  },
] as const;
