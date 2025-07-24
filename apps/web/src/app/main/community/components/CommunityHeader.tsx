import LogoImage from '@/assets/images/LogoImage';
import { Button } from '@/components/buttons/Button';
import { Search } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface CommunityHeaderProps {
  className?: string;
}
export function CommunityHeader({
  className = '',
}: CommunityHeaderProps) {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between w-full h-[50px] px-5 py-4 bg-transparent ',
        className,
      )}
    >
      <LogoImage className="h-10" />

      <Button variant="ghost" className="px-0">
        <Search className="h-5" />
      </Button>
    </div>
  );
}
