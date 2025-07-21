// apps/web/app/main/community/page.tsx
import Input from '@/components/inputs/Input';
import PillButton from './components/PillButton';
import { Search } from 'lucide-react';
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
        <div className="flex-1 w-full max-w-3xl px-4 py-6">
          <Input
            placeholder="검색"
            className="mb-4"
            leftIcon={<Search className="h-5 w-5 stroke-current" />}
          />
        </div>
      </div>
    </div>
  );
}
