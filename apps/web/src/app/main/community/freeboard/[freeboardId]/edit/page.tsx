'use client';

import { useParams, useRouter } from 'next/navigation';
import { FreeboardForm } from '../../new/components/FreeboardForm';
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
 * - 게시글 데이터 로딩 중에는 로딩 UI 표시
 * - 권한이 없거나 게시글이 없으면 에러 처리
 * - 로딩 완료 후 FreeboardForm에 postId와 initialData 전달
 */
export default function FreeboardEditPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.freeboardId);

  // 게시글 데이터 조회
  const { data, isLoading, error } = useGetPost(postId);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="w-full h-full">
        <Header>
          <Header.Left>
            <Header.BackButton />
          </Header.Left>
          <Header.Center>글 수정</Header.Center>
        </Header>
        <main className="w-full h-full p-layout flex items-center justify-center">
          <div className="text-neutral-600 dark:text-neutral-400">
            게시글을 불러오는 중...
          </div>
        </main>
      </div>
    );
  }

  // 에러 또는 데이터 없음
  if (error || !data) {
    return (
      <div className="w-full h-full">
        <Header>
          <Header.Left>
            <Header.BackButton />
          </Header.Left>
          <Header.Center>글 수정</Header.Center>
        </Header>
        <main className="w-full h-full p-layout flex flex-col items-center justify-center gap-4">
          <div className="text-neutral-600 dark:text-neutral-400">
            게시글을 불러올 수 없습니다.
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            돌아가기
          </button>
        </main>
      </div>
    );
  }

  // 수정 권한 체크
  if (!data.canEdit) {
    return (
      <div className="w-full h-full">
        <Header>
          <Header.Left>
            <Header.BackButton />
          </Header.Left>
          <Header.Center>글 수정</Header.Center>
        </Header>
        <main className="w-full h-full p-layout flex flex-col items-center justify-center gap-4">
          <div className="text-neutral-600 dark:text-neutral-400">
            이 게시글을 수정할 권한이 없습니다.
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            돌아가기
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Header>
        <Header.Left>
          <Header.CancelButton />
        </Header.Left>
        <Header.Center>글 수정</Header.Center>
      </Header>
      <main className="w-full h-full p-layout">
        <FreeboardForm freeboardId={postId} initialData={data} />
      </main>
    </div>
  );
}
