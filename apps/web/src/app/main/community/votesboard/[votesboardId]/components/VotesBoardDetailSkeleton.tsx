'use client';

import Skeleton from '@/components/loadings/Skeleton';

/** 게시글 상세 로딩 스켈레톤 */
export default function VotesBoardDetailSkeleton() {
  return (
    <div className="p-5 space-y-6">
      {/* 카테고리 */}
      <Skeleton className="w-16 h-4" />

      {/* 프로필 */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>

      {/* 제목 */}
      <Skeleton className="w-2/3 h-6" />

      {/* 이미지 */}
      <Skeleton className="w-full h-[200px] rounded-lg" />

      {/* 본문 */}
      <div className="space-y-3">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
      </div>

      {/* 하단 (좋아요 / 조회수) */}
      <div className="flex justify-between items-center">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-10 h-4" />
      </div>
    </div>
  );
}
