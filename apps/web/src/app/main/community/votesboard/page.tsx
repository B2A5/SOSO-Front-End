'use client';

import { useState } from 'react';
import { FilterHeader } from '../components/FilterHeader';
import { SORT_OPTIONS } from '../constants/sortOptions';
import { SortValue } from '@/types/options.types';

/**
 * 투표 게시판 메인 페이지
 *
 * @description
 * - [전체/진행중/완료] 상태 탭 제공
 * - 상태별 투표 게시글 목록 표시
 * - 정렬 옵션 제공
 *
 * @todo
 * - 투표 게시글 API 연동
 * - 무한스크롤 구현
 * - 투표 카드 컴포넌트 구현
 */

export default function VotesboardPage() {
  const [sortOption, setSortOption] = useState<SortValue>(
    SORT_OPTIONS[0].value,
  );

  return (
    <div className="w-full h-full flex flex-col">
      {/* 필터 헤더 */}
      <FilterHeader
        totalCount={0}
        options={SORT_OPTIONS}
        filterValue={sortOption}
        onFilterChange={setSortOption}
      />

      {/* 게시글 목록 */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-neutral-500 text-center">
            투표 게시글이 없습니다.
            <br />
            TODO: 투표 목록 구현 예정
          </p>
        </div>
      </div>

      {/* TODO: FloatingButton 추가 */}
    </div>
  );
}
