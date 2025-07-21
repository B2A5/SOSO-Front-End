import { Button } from '@/components/buttons/Button';
import { ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface PillButtonProps {
  onClick?: () => void;
  className?: string;
}
export default function PillButton({
  onClick,
  className,
}: PillButtonProps) {
  return (
    <Button
      className={twMerge(
        'bg-soso-600 text-white rounded-full px-4 py-2 hover:bg-soso-700 transition-colors',
        className,
      )}
      endIcon={<ChevronRight />}
      onClick={onClick}
    >
      투표하러 가기
    </Button>
  );
}
