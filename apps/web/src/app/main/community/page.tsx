// apps/web/app/main/community/page.tsx
/**
 * 커뮤니티 페이지
 *
 */
export default function CommunityPage() {
  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">커뮤니티</h1>
      </header>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>커뮤니티 콘텐츠가 들어갈 예정입니다.</p>
        </div>
      </div>
    </div>
  );
}
