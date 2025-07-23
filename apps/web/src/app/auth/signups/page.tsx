//회원가입 초기 시작 페이지
// apps/web/src/app/auth/signup/Page.tsx
'use client';
import React, { useState } from 'react';
import { UserType, postUserType } from '@/api/signup';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/buttons/Button';
import { SelectCard } from './components/SelectCard';

import { useToast } from '@/hooks/ui/useToast';
export default function SignUpPage() {
  const router = useRouter();
  const toast = useToast();
  const [userType, setUserType] = useState<UserType | null>(null);
  // 선택한 유저 타입을 서버에 전송하는 mutation
  const { mutate, isPending } = useMutation({
    mutationFn: postUserType,
    onSuccess: () => {
      // 성공 시 처리 로직
      console.log('유저 타입이 성공적으로 저장되었습니다.');
      const type = userType === 'FOUNDER' ? 'founder' : 'inhabitant';
      router.push(`/auth/signup/${type}/region`);
    },
    onError: (error) => {
      // 에러 처리 로직
      console.error('유저 타입이 일치하지 않습니다.', error);
      toast('서버 에러가 발생했습니다. 다시 시도해주세요.', 'error');
    },
  });

  // 유저 타입을 선택하는 핸들러
  const handleSelect = (type: UserType) => {
    setUserType(type);
  };

  // 다음 버튼 클릭 핸들러
  const handleNextButton = () => {
    if (!userType) {
      console.error('유저 타입이 선택되지 않았습니다.');
      return;
    }
    mutate(userType);
  };

  return (
    <div className="h-full flex flex-col items-center justify-end gap-19  p-layout">
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
          isSelected={userType === 'FOUNDER'}
          onClick={() => {
            handleSelect('FOUNDER');
          }}
        />
        <SelectCard
          title="주민"
          description="우리 동네에 필요한 가게를 제안하고 싶어요"
          isSelected={userType === 'INHABITANT'}
          onClick={() => {
            handleSelect('INHABITANT');
          }}
        />
      </section>
      <div className="w-full flex flex-col gap-1">
        <p className="text-center text-neutral-500">
          나중에 마이페이지에서 변경 가능합니다
        </p>
        <Button
          size="lg"
          className="w-full mt-1"
          onClick={handleNextButton}
          isLoading={isPending}
          disabled={!userType}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
