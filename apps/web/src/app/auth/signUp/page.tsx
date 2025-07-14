//회원가입 초기 시작 페이지
// apps/web/src/app/auth/signup/Page.tsx
'use client';
import { Button } from '@/components/buttons/Button';
import { SelectCard } from './components/SelectCard';
import React, { useState } from 'react';
import { UserType } from '@/api/signup';

export default function SignUpPage() {
  const [userType, setUserType] = useState<UserType | null>(null);

  const handleSelect = (type: UserType) => {
    setUserType(type);
  };
  return (
    <div className="h-full flex flex-col items-center justify-end gap-19">
      <section className="w-full flex flex-col justify-center items-center gap-2 ">
        <h3 className="text-2xl font-bold dark:text-white">
          어떤 사용자에 가까우신가요?
        </h3>
        <p className="text-sm text-neutral-600  dark:text-neutral-300">
          더 나은 맞춤형 서비스를 위해 알려주세요
        </p>
      </section>
      <section className="flex flex-col gap-6">
        <SelectCard
          title="예비 창업자"
          description="창업할 지역과 아이템을 계획 중이에요"
          onClick={() => {
            handleSelect('FOUNDER');
          }}
        />
        <SelectCard
          title="주민"
          description="우리 동네에 필요한 가게를 제안하고 싶어요"
          onClick={() => {
            handleSelect('REGION');
          }}
        />
      </section>
      <div className="w-full flex flex-col gap-1">
        <p className="text-center text-neutral-500">
          나중에 마이페이지에서 변경 가능합니다{userType}
        </p>
        <Button size="lg" className="w-full" onClick={() => {}}>
          다음
        </Button>
      </div>
    </div>
  );
}
