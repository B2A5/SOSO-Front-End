// apps/web/app/main/community/page.tsx

import { CommunityHeader } from './components/CommunityHeader';

/**
 * 커뮤니티 메인 페이지
 *
 */
interface CommunityLayoutProps {
  children: React.ReactNode;
}

export default function CommunityLayout({
  children,
}: CommunityLayoutProps) {
  return (
    <div className="flex flex-col h-full w-full">
      <CommunityHeader className="w-full" />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
