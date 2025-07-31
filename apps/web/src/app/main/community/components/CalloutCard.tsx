// apps/web/src/app/main/community/components/CalloutCard.tsx
import { twMerge } from 'tailwind-merge';
import { Lightbulb } from 'lucide-react';
/**
 * CalloutCard 컴포넌트
 * 사용자에게 중요한 정보를 강조하는 카드 형태의 컴포넌트입니다.
 */
interface CalloutCardProps {
  content: string;
  className?: string;
}
export default function CalloutCard({
  content,
  className,
}: CalloutCardProps) {
  return (
    <div
      className={twMerge(
        'relative w-[340px] h-10 z-0 bg-soso-600 rounded-[11px]',
        className,
      )}
    >
      <div className="absolute z-10 top-0 h-10 left-1/2 transform-t w-[336px] bg-soso-0 rounded-[10px] -translate-x-1/2">
        <div className="flex items-center px-5 py-2 gap-[7px]">
          <Lightbulb className="text-soso-600 size-5" />
          <p className="text-caption2 text-neutral-800">{content}</p>
        </div>
      </div>
    </div>
  );
}
