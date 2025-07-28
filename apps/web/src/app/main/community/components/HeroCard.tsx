import { DefaultSomoon } from '@/assets/images/DefaultSomoon';
import Card from '@/components/Card';
import { MapPin } from 'lucide-react';
export const SUMMERY = {};
/**
 * 커뮤니티 메인 페이지의 히어로 카드 컴포넌트
 * - 현재 위치 정보와 참여자, 활동지수, 이번주 글 수 표시
 */

export function HeroCard({ className }: { className?: string } = {}) {
  const MockData = {
    location: '00시 00구 00동',
    participants: 100,
    activityRate: 75,
    postsThisWeek: 10,
  };
  return (
    <Card
      className={`w-full relative ${className} flex flex-col items-center gap-4 p-5`}
    >
      <div className="w-full flex items-center gap-3">
        <MapPin className="w-5 h-5 text-neutral-700" />
        <h4 className="text-input">00시 00구 00동</h4>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-input2 text-soso-600">
            {MockData.participants}
          </p>
          <p className="text-caption3">참여자</p>
        </div>
        <div className="flex flex-col">
          <p className="text-input2 text-soso-600">
            {' '}
            {MockData.activityRate}%
          </p>
          <p className="text-caption3">활동 지수</p>
        </div>
        <div className="flex flex-col">
          <p className="text-input2 text-soso-600">
            {' '}
            {MockData.postsThisWeek}
          </p>
          <p className="text-caption3">이번 주 글</p>
        </div>
      </div>
      <DefaultSomoon className="w-[50px] absolute -top-7 left-0" />
    </Card>
  );
}
