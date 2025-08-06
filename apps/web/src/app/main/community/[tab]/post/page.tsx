'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { FreeboardForm } from './components/FreeboardForm';
import { VotesboardForm } from './components/VotesboardForm';

/**
 * 탭에 따라 다른 게시판을 보여주는 페이지입니다.
 * - freeboard: 자유게시판 폼
 * - votesboard: 투표게시판 폼
 */
export default function PostPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const tab = params.tab as string;
  const category = searchParams.get('tab');

  // 탭에 따라 다른 폼 컴포넌트 렌더링
  const renderForm = () => {
    switch (tab) {
      case 'freeboard':
        return <FreeboardForm postData={null} />;
      case 'votesboard':
        return <VotesboardForm postData={null} />;
      default:
        return <FreeboardForm postData={null} />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* 카테고리 정보 표시 (개발용) */}
      {category && (
        <div className="mb-4 p-2 bg-gray-100 rounded">
          선택된 카테고리: {category}
        </div>
      )}

      {renderForm()}
    </div>
  );
}
