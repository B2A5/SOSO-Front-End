'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/buttons/Button';
import { SlotMachineText } from '@/components/SlotMachineText';
import CompleteImg from './components/CompleteImg';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import {
  useSaveNickname,
  useCompleteSignup,
} from '@/generated/api/endpoints/signup/signup';
import { useSignupFlow } from '@/hooks/useSignupFlow';
import { User } from '@/types/auth.types';

export default function SignUpCompletePage() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const { userType } = useSignupFlow();
  const userTypeLabel =
    userType === 'FOUNDER' ? '예비 창업자' : '주민';
  const [nickname, setNickname] = useState<string | null>(null);
  const words = [
    '행복한 문어',
    '쓸쓸한 문어',
    '화려한 문어',
    '슬픈 문어',
    '귀여운 문어',
  ];

  const { mutate: getNickname, isPending } = useSaveNickname({
    mutation: {
      onSuccess: (data) => {
        setNickname(data.data);
        console.log('닉네임이 성공적으로 생성되었습니다:', data.data);
      },
      onError: (error) => {
        console.error('Error saving nickname:', error);
      },
    },
  });

  const { mutate: completeSignup } = useCompleteSignup({
    mutation: {
      onSuccess: (data) => {
        const { jwtAccessToken } = data.data;

        if (nickname) {
          login({
            user: { nickname } as User,
            accessToken: jwtAccessToken,
          });
          console.log('로그인이 완료되었습니다:', { data, nickname });
        } else {
          console.error('닉네임 정보가 없어 로그인할 수 없습니다.');
        }
      },
      onError: (error) => {
        console.error('Error completing signup:', error);
      },
    },
  });

  const handleButtonClick = () => {
    completeSignup({});
    router.replace('/main');
  };

  useEffect(() => {
    getNickname({});
  }, [getNickname]);

  return (
    <div className="p-layout w-full h-full flex flex-col items-center justify-between pt-[90px]">
      <div className="flex flex-col items-center gap-4 max-w-[270px] w-full">
        <h1 className="text-hero dark:text-white">
          가입이 완료됐어요!
        </h1>
        <p className="text-body1 text-center dark:text-white">
          &quot;SOSO&quot;의 {userTypeLabel}
          <SlotMachineText options={words} targetText={nickname!} />
          님의 <br />
          앞날을 응원할게요!
        </p>
      </div>
      <div className="flex-1 w-full flex justify-center items-center">
        <CompleteImg />
      </div>
      <Button
        isLoading={isPending}
        className="w-full animate-pulse"
        onClick={handleButtonClick}
      >
        SOSO 시작하기
      </Button>
    </div>
  );
}
