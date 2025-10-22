'use client';

import { Header } from '@/components/header/Header';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

/** 자유게시판 게시글 상세 레이아웃 */
/* 메뉴 버튼 기능 구현 예정 - 바텀시트 연동
/** */
export default function FreeboardDetailLayout({
  children,
}: PropsWithChildren) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full w-full">
      <Header>
        <Header.Left>
          <Header.BackButton onClick={() => router.back()} />
        </Header.Left>

        <Header.Center>자유게시판</Header.Center>

        <Header.Right>
          <Header.MenuButton />
        </Header.Right>
      </Header>

      {/* 본문 */}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
