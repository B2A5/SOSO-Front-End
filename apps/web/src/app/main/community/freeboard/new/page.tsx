'use client';

import { useSearchParams } from 'next/navigation';
import { FreeboardForm } from './components/FreeboardForm';
import { Header } from '@/components/header/Header';

export default function FreeboardNewPage() {
  const category = useSearchParams().get('category') || undefined;

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
