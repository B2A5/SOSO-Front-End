// apps/web/app/main/community/page.tsx

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Card from '@/components/Card';
import { CommunityHeader } from './components/CommunityHeader';
/**
 * 커뮤니티 메인 페이지
 *
 */
export default function CommunityPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col items-center h-30">
        {/* 상단 헤더 영역 */}
        <CommunityHeader />
      </div>
      {/* 커뮤니티 내용 영역 */}
      <div className="flex-1 w-full gap-4 px-4 pt-6">
        {/* 검색 입력창: 입력 받는게 아니라 검색 팝업 */}

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            {/* 진행중인 아이디어 이동 */}
            <div className="flex justify-between items-center ">
              <h3 className="text-title1">진행중인 아이디어</h3>
              <Link
                href="/main/community/votes"
                className="flex items-center gap-2 hover:text-soso-600 active:text-soso-600"
              >
                <ChevronRight />
              </Link>
            </div>
            {/* 아이디어 카드 목록 */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <h4 className="text-title2">아이디어 제목</h4>
                <p className="text-body">아이디어 설명</p>
              </Card>
              <Card>
                <h4 className="text-title2">아이디어 제목</h4>
                <p className="text-body">아이디어 설명</p>
              </Card>
            </div>
          </div>
          {/* 인기 게시글 이동 */}
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center ">
              <h3 className="text-title1">인기 게시글</h3>
              <Link
                href="/main/community/freeboard"
                className="flex items-center gap-2 hover:text-soso-600 active:text-soso-600"
              >
                <ChevronRight />
              </Link>
            </div>
            {/* 게시글 카드 목록 */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <h4 className="text-title2">게시글 제목</h4>
                <p className="text-body">게시글 설명</p>
              </Card>
              <Card>
                <h4 className="text-title2">게시글 제목</h4>
                <p className="text-body">게시글 설명</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
