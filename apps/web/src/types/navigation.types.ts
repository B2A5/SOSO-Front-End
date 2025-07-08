// apps/web/src/types/navigation.ts
import { MessageCircle, Map, Lightbulb, User } from 'lucide-react';

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
    icon: MessageCircle,
  },
  {
    href: '/main/map',
    label: '지도',
    icon: Map,
  },
  {
    href: '/main/founder',
    label: '창업 도우미',
    icon: Lightbulb,
  },
  {
    href: '/main/profile',
    label: '마이페이지',
    icon: User,
  },
] as const;
