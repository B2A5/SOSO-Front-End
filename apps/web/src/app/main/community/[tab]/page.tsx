'use client';
import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PillChipsTab } from '@/components/tabs/PillChipsTab';
import { CATEGORIES, Category } from '../constants/categories';
import { FilterHeader } from '../components/FilterHeader';
import { SortValue } from '@/types/options.types';
import { SORT_OPTIONS } from '../constants/sortOptions';
import FloatingButton from '@/components/buttons/FloatingButton';
import ContentsList from '../components/ContentsList';
import { mockGetPostsByCursor } from '../mock/mockPosts';
import type { PostCursorResponse } from '@/api/posts';

/**
 * 커뮤니티 탭 페이지 (레거시 - [tab] 동적 라우팅)
 * - 카테고리별 게시글 목록을 보여주는 페이지
 * - 무한스크롤 기능 포함
 * - 카테고리 및 정렬 옵션 선택 가능
 * @todo: 목업 데이터를 실제 데이터로 교체
 * @deprecated 새로운 votesboard/freeboard 구조로 마이그레이션 예정
 */

export default function CommunityTabPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [sortOption, setSortOption] = useState<SortValue>(
    SORT_OPTIONS[0].value,
  );

  // 무한스크롤 데이터 페칭
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts', category, sortOption],
    queryFn: ({ pageParam }) =>
      // 테스트용 mock 데이터 사용
      mockGetPostsByCursor({
        category: category ?? undefined,
        sort: sortOption,
        cursor: pageParam,
        size: 10,
      }),
    initialPageParam: '1',
    getNextPageParam: (lastPage: PostCursorResponse) => {
      return lastPage.nextCursor.hasNext
        ? lastPage.nextCursor.cursor
        : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  // 모든 페이지의 게시글을 하나의 배열로 합치기
  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  // 총 게시글 개수 (첫 번째 페이지 기준으로 추정)
  const totalCount = data?.pages[0]?.posts.length
    ? allPosts.length + (hasNextPage ? 10 : 0)
    : 0;

  return (
    <div className="w-full h-full flex flex-col">
      <PillChipsTab<Category>
        chips={CATEGORIES}
        activeValue={category}
        onChange={setCategory}
        showAll
      />
      <FilterHeader
        totalCount={totalCount}
        options={SORT_OPTIONS}
        filterValue={sortOption}
        onFilterChange={setSortOption}
      />
      <div className="flex-1 overflow-y-auto px-4">
        {error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 text-center">
              게시글을 불러오는 중 오류가 발생했습니다.
            </p>
          </div>
        ) : (
          <ContentsList
            posts={allPosts}
            hasNextPage={hasNextPage || false}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isLoading}
            type="freeboard"
          />
        )}
      </div>
      <FloatingButton categories={CATEGORIES} />
    </div>
  );
}
