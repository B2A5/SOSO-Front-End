/**
 * 커뮤니티 공통 레이아웃
 *
 * @description
 * 투표 게시판과 자유 게시판의 공통 컨테이너
 */
export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full">{children}</div>
  );
}
