'use client';

import { useSearchParams } from 'next/navigation';
import { FreeboardForm } from './components/FreeboardForm';
import { Header } from '@/components/header/Header';
import {
  CATEGORIES,
  type Category,
} from '../../constants/categories';

export default function FreeboardNewPage() {
  const params = useSearchParams();
  const rawCategory = params.get('category');

  // 유효한 카테고리인지 검증
  const category: Category | undefined =
    rawCategory &&
    CATEGORIES.some((category) => category.value === rawCategory)
      ? (rawCategory as Category)
      : undefined;

  return (
    <div className=" w-full h-full">
      <Header>
        <Header.Left>
          <Header.CancelButton />
        </Header.Left>
        <Header.Center>자유 글 작성</Header.Center>
      </Header>
      <main className="w-full h-full p-layout">
        <FreeboardForm
          initialData={null}
          initialCategory={category}
        />
      </main>
    </div>
  );
}
