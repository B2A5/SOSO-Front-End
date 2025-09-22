// apps/web/src/types/navigation.ts
import Community from 'public/icons/appbar-community.svg';
import Map from 'public/icons/appbar-map.svg';
import Home from 'public/icons/appbar-home.svg';
import Sprout from 'public/icons/appbar-sprout.svg';
import Profile from 'public/icons/appbar-profile.svg';

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
    icon: Community,
  },
  {
    href: '/main/maps',
    label: '지도',
    icon: Map,
  },
  {
    href: '/main/home',
    label: '홈',
    icon: Home,
  },
  {
    href: '/main/founder',
    label: '창업 도우미',
    icon: Sprout,
  },

  {
    href: '/main/profile',
    label: '마이페이지',
    icon: Profile,
  },
] as const;
