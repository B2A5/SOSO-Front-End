// components/UserProfile.tsx
'use client';

import { Home, Sprout } from 'lucide-react';
import Image from 'next/image';
import { relativeTime } from '@/utils/relativeTime';

export interface UserProfileProps {
  nickname: string;
  profileImageUrl: string;
  userType: 'founder' | 'resident';
  location: string;
  createdAt: string;
}

export default function UserProfile({
  nickname,
  profileImageUrl,
  userType,
  location,
  createdAt,
}: UserProfileProps) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={profileImageUrl}
        alt="유저 프로필 이미지"
        className="w-[45px] h-[45px] rounded-full overflow-hidden bg-neutral-50 p-1"
        width={45}
        height={45}
      />
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-body font-bold">{nickname}</h2>
          <div className="text-[8px] px-1 py-0.5 rounded-full text-white bg-soso-600 flex gap-0.5 items-center">
            {userType === 'founder' ? (
              <>
                창업자
                <Sprout className="w-2 h-2" />
              </>
            ) : (
              <>
                주민
                <Home className="w-2 h-2" />
              </>
            )}
          </div>
        </div>
        <p className="text-sm text-neutral-500">
          {location} · {relativeTime(createdAt)}
        </p>
      </div>
    </div>
  );
}
