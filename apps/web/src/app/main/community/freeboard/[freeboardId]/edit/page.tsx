'use client';

import { useParams } from 'next/navigation';
import { FreeboardForm } from '../../components/FreeboardForm';
import { FreeboardFormSkeleton } from '../../components/FreeboardForm.Skeleton';
import { Header } from '@/components/header/Header';
import { useGetPost } from '@/generated/api/endpoints/freeboard/freeboard';

/**
 * 자유게시판 게시글 수정 페이지
 *
 * @description
 * 기존 게시글을 수정하는 페이지입니다.
 * URL 파라미터에서 게시글 ID를 받아 데이터를 로딩하고,
 * FreeboardForm 컴포넌트를 통해 수정 UI를 제공합니다.
 *
 * @remarks
 * - 게시글 데이터 로딩 중에는 스켈레톤 UI 표시
 * - 로딩 완료 후 FreeboardForm에 postId와 initialData 전달
 * @todo
 * - 권한이 없거나 게시글이 없으면 에러 모달 표시
 */
export default function FreeboardEditPage() {
  const params = useParams();
  const postId = Number(params.freeboardId);

  // 게시글 데이터 조회
  const { data, isLoading } = useGetPost(postId);

  return (
    <div className="flex flex-col w-full h-full">
      <Header>
        <Header.Left>
          <Header.CancelButton />
        </Header.Left>
        <Header.Center>자유 글 수정</Header.Center>
      </Header>

      <main className="flex-1 w-full overflow-hidden p-layout">
        {isLoading ? (
          <FreeboardFormSkeleton />
        ) : (
          <FreeboardForm freeboardId={postId} initialData={data} />
        )}
      </main>
    </div>
  );
}
