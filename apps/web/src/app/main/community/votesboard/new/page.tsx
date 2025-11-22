// apps/web/src/app/main/community/votesboard/new/page.tsx
'use client';

import { Header } from '@/components/header/Header';
import { VoteboardForm } from '../components/VoteboardForm';

/**
 * 투표 글 작성 페이지
 *
 * @description
 * 새 투표 게시글을 작성하는 페이지입니다.
 * 상단 헤더와 VoteboardForm 컴포넌트로 구성됩니다.
 *
 * @remarks
 * - 현재 투표 게시글에는 카테고리 스펙이 없습니다.
 * - FreeboardNewPage처럼 URL의 searchParams에서 카테고리를 읽어와
 *   초기값으로 넘겨주지 않습니다.
 *
 * @todo
 * - 백엔드 투표 API에 카테고리가 추가되면:
 *   1) searchParams에서 category를 읽어오고,
 *   2) VoteboardForm에 initialCategory(또는 유사 필드)를 전달하는 로직을 추가합니다.
 */
export default function VoteboardNewPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <Header>
        <Header.Left>
          <Header.CancelButton />
        </Header.Left>
        <Header.Center>투표 글 작성</Header.Center>
      </Header>

      <main className="flex-1 w-full overflow-hidden p-layout">
        {/* 신규 작성 모드: voteId, initialData 없이 폼만 렌더링 */}
        <VoteboardForm />
      </main>
    </div>
  );
}
