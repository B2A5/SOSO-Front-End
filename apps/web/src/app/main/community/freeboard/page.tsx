'use client';
import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PillChipsTab } from '@/components/tabs/PillChipsTab';
import { CATEGORIES, Category } from '../constants/categories';
import { SortHeader } from '../components/SortHeader';
import { SortValue } from '@/types/options.types';
import { SORT_OPTIONS } from '../constants/sortOptions';
import FloatingButton from '@/components/buttons/FloatingButton';
import { FreeBoardCard } from '../components/FreeboardCard';
import CommunityPostList from '../components/CommunityPostList';
import {
  getGetPostsByCursorQueryKey,
  getPostsByCursor,
} from '@/generated/api/endpoints/freeboard/freeboard';
import type { FreeboardSummary } from '@/generated/api/models';

/**
 * 자유 게시판 메인 페이지
 *
 * @description
 * - 카테고리별 게시글 목록을 보여주는 페이지
 * - 무한스크롤 기능 포함
 * - 카테고리 및 정렬 옵션 선택 가능
 */

export default function FreeboardPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [sortOption, setSortOption] = useState<SortValue>('LATEST');

  // 무한스크롤 데이터 페칭
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: getGetPostsByCursorQueryKey({
      // queryKey 생성 함수 사용
      category: category ?? undefined, // null일 경우 undefined로 변환
      sort: sortOption,
    }),
    queryFn: ({ pageParam, signal }) =>
      getPostsByCursor(
        //generated api 함수 사용
        {
          category: category ?? undefined,
          sort: sortOption,
          cursor: pageParam,
          size: 10,
        },
        signal,
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });

  // 모든 페이지의 게시글을 하나의 배열로 합치기
  const allFreeboardPosts: FreeboardSummary[] =
    data?.pages.flatMap((page) => page.posts ?? []) ?? [];
  // 총 게시글 개수
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return (
    <main className="w-full h-full flex flex-col">
      <PillChipsTab<Category>
        chips={CATEGORIES}
        activeValue={category}
        onChange={setCategory}
        showAll
        ariaLabel="카테고리 선택 필터"
      />
      <SortHeader
        totalCount={totalCount}
        sortOptions={SORT_OPTIONS}
        currentValue={sortOption}
        onFilterChange={setSortOption}
      />
      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <p className="text-red-500 text-center">
            게시글을 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      ) : (
        <CommunityPostList<FreeboardSummary>
          items={allFreeboardPosts}
          hasNextPage={hasNextPage || false}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          initialLoading={isLoading}
          getItemKey={(post, index) => post.postId ?? `post-${index}`}
          renderItem={(post) => (
            <FreeBoardCard
              key={post.postId}
              post={post}
              isChip={true}
            />
          )}
          emptyMessage="아직 작성된 게시글이 없습니다."
        />
      )}
      <FloatingButton categories={CATEGORIES} />
    </main>
  );
}
