'use client';
import React, { useState } from 'react';
import { CategoryTab } from '@/components/tabs/CategoryTab';
import { Categories } from '@/types/tab.types';
import { CATEGORIES } from '../../../../constants/categories';
import { FilterHeader } from '../components/FilterHeader';
import { SortValue } from '@/types/options.types';
import { SORT_OPTIONS } from '../constants/sortOptions';
import FloatingButton from '@/components/buttons/FloatingButton';

export default function CommunityTabPage() {
  const [category, setCategory] = useState<Categories>(CATEGORIES[0]);
  const [sortOption, setSortOption] = useState<SortValue>(
    SORT_OPTIONS[0].value,
  );

  return (
    <div className="w-full h-full flex flex-col">
      <CategoryTab
        tabs={CATEGORIES}
        defaultValue={category.value}
        onChange={(value) => {
          setCategory(
            CATEGORIES.find((cat) => cat.value === value) ||
              CATEGORIES[0],
          );
        }}
      />
      <FilterHeader
        totalCount={100}
        options={SORT_OPTIONS}
        filterValue={sortOption}
        onFilterChange={setSortOption}
      />
      <div>{/* 카드 리스트 */}</div>
      <FloatingButton categories={CATEGORIES} />
    </div>
  );
}
