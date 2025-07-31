'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Tab } from '@/components/Tab';
import { SortOption } from '@/types/options.types';
import { FilterHeader } from '../components/FilterHeader';
//import Contents from './Contents';
import FloatingButton from '@/components/buttons/FloatingButton';

export const TAB_LIST = [
  '전체',
  '일상/취미',
  '맛집',
  '생활/팁',
  '동네소식',
];

const SORT_OPTIONS: SortOption[] = [
  { label: '최신순', value: 'LATEST' },
  { label: '인기순', value: 'LIKE' },
  { label: '댓글순', value: 'COMMENT' },
];

export default function CommunityPage() {
  const [currentTab, setCurrentTab] = useState('전체');
  const [sortType, setSortType] = useState(SORT_OPTIONS[0].value);
  return (
    <div>
      <Header title="자유게시판" showSearch />
      <Tab
        tabs={TAB_LIST}
        activeTab={currentTab}
        onTabChange={setCurrentTab}
      />
      <FilterHeader
        options={SORT_OPTIONS}
        onFilterChange={setSortType}
        filterValue={sortType}
      />
      <div>{/* <Contents /> */}</div>
      <FloatingButton />
    </div>
  );
}
