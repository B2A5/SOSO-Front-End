'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Tab } from '@/components/Tab';

export const TAB_LIST = [
  '전체',
  '일상/취미',
  '맛집',
  '생활/팁',
  '동네소식',
];

// const SORT_TYPES: { label: string; value: string }[] = [
//   { label: '최신순', value: 'latest' },
//   { label: '인기순', value: 'popular' },
// ];

export default function CommunityPage() {
  const [currentTab, setCurrentTab] = useState('전체');
  return (
    <div>
      <Header title="자유게시판" showSearch />
      <Tab
        tabs={TAB_LIST}
        activeTab={currentTab}
        onTabChange={setCurrentTab}
      />
    </div>
  );
}
