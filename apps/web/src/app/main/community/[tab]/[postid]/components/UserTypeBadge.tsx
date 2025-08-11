// components/profile/UserTypeBadge.tsx
import { Home, Sprout } from 'lucide-react';

export function UserTypeBadge({
  type,
}: {
  type: 'founder' | 'resident';
}) {
  return (
    <span className="text-[8px] px-1 py-0.5 rounded-full text-white bg-soso-600 inline-flex items-center gap-0.5">
      {type === 'founder' ? (
        <>
          창업자 <Sprout className="w-2 h-2" aria-hidden="true" />
        </>
      ) : (
        <>
          주민 <Home className="w-2 h-2" aria-hidden="true" />
        </>
      )}
    </span>
  );
}
