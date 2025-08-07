'use client';

import { useParams } from 'next/navigation';
import { FreeboardForm } from './components/FreeboardForm';
import { VotesboardForm } from './components/VotesboardForm';

/**
 * 탭에 따라 다른 게시판을 보여주는 페이지입니다.
 * - freeboard: 자유게시판 폼
 * - votesboard: 투표게시판 폼
 */
export default function PostPage() {
  const params = useParams();

  const tab = params.tab as string;

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
    <div className="container w-full h-full p-layout">
      {renderForm()}
    </div>
  );
}
