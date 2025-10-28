// app/main/community/freeboard/[freeboardId]/page.tsx
import { notFound } from 'next/navigation';
import FreeboardDetail from './components/FreeboardDetail';
import CommentList from './components/CommentList';
import CommentInput from './components/CommentInput';
import FreeboardDetailSkeleton from './components/FreeboardDetailSkeleton';
import type { FreeboardDetailResponse } from '@/generated/api/models';

export default async function Page({
  params,
}: {
  params: { freeboardId: string };
}) {
  // 1) 파라미터 검증
  const postId = Number(params.freeboardId);
  if (!Number.isFinite(postId)) return <FreeboardDetailSkeleton />;

  // 2) API 베이스 URL (절대 URL만 허용)
  const rawBase =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    '';
  const base = rawBase.replace(/\/$/, '');
  if (!/^https?:\/\//.test(base)) return <FreeboardDetailSkeleton />;

  // 3) SSR 단일 패치
  const res = await fetch(`${base}/community/freeboard/${postId}`, {
    cache: 'no-store',
    headers: { accept: 'application/json' },
  });

  if (res.status === 404) notFound();
  if (!res.ok) return <FreeboardDetailSkeleton />;

  const post: FreeboardDetailResponse = await res.json();

  // 4) 렌더
  return (
    <main className="space-y-6">
      <FreeboardDetail post={post} />

      <section className="px-5 pb-6">
        {/* SSR에서 받은 총 댓글 수를 헤더 표시에 사용 */}
        <CommentList
          postId={postId}
          initialCount={post.commentCount}
        />
        <div className="fixed bottom-16 left-0 right-0 z-50 px-5 py-3">
          <CommentInput postId={postId} />
        </div>
      </section>

      {/* safe-area 보정 */}
      <div className="fixed inset-x-0 bottom-16 z-50 bg-transparent">
        <div className="backdrop-blur-[2px] bg-white/90 w-full h-full absolute top-0 z-[-1]" />
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </main>
  );
}
