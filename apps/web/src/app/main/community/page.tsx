// apps/web/app/main/community/page.tsx
import Input from '@/components/inputs/Input';
import PillButton from './components/PillButton';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import Card from '@/components/Card';
/**
 * 커뮤니티 메인 페이지
 *
 */
export default function CommunityPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center h-full">
        {/* 상단 헤더 영역 */}
        <div className="relative not-even:bg-soso-100 w-full h-80 flex items-center justify-center">
          <h2 className="text-header2">
            &quot;우리동네&quot;
            <br /> 칵테일 바가 생겼으면 좋겠나요?
          </h2>
          <PillButton className="absolute bottom-10 right-6" />
        </div>
        {/* 커뮤니티 내용 영역 */}
        <div className="flex-1 w-full gap-4 px-4 pt-6">
          <Input
            placeholder="검색"
            className="mb-4"
            leftIcon={<Search className="h-5 w-5 stroke-current" />}
          />
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
            {/* 아이디어 카드 컴포넌트 */}
            <Card>
              <h4 className="text-title2">아이디어 제목</h4>
              <p className="text-body">아이디어 설명</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
