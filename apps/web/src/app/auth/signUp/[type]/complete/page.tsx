'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/buttons/Button';
import { useParams } from 'next/navigation';
import { RandomTextSpan } from '@/components/RandomTextSpan';
import CompleteImg from './components/CompleteImg';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import {
  postNickname,
  postSignupComplete,
  SignupCompleteResponse,
} from '@/api/signup';
import { User } from '@/types/auth.types';

export default function SignUpCompletePage() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const params = useParams();

  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;
  const paramType = rawType?.toLowerCase();
  const userType = paramType === 'founder' ? '예비 창업자' : '주민';
  const [nickname, setNickname] = useState<User | null>(null);
  const targetText = nickname?.nickname ?? '';
  const words = [
    '행복한 문어',
    '쓸쓸한 문어',
    '화려한 문어',
    '슬픈 문어',
    '귀여운 문어',
  ];

  const { mutate: getNickname, isPending } = useMutation({
    mutationFn: postNickname,
    onSuccess: (data) => {
      setNickname(data);
    },
    onError: (error) => {
      console.error('Error saving nickname:', error);
    },
  });

  const { mutate: completeSignup } = useMutation({
    mutationFn: postSignupComplete,
    onSuccess: (data: SignupCompleteResponse) => {
      const { JwtAccessToken } = data;

      if (nickname) {
        login({ user: nickname, accessToken: JwtAccessToken });
        console.log('로그인이 완료되었습니다:', { data, nickname });
      } else {
        console.error('닉네임 정보가 없어 로그인할 수 없습니다.');
      }
    },
    onError: (error) => {
      console.error('Error completing signup:', error);
    },
  });

  const handleButtonClick = () => {
    // 회원가입 완료 로직
    completeSignup();
    router.replace('/');
  };

  useEffect(() => {
    getNickname();
  }, [getNickname]);

  return (
    <div className="p-layout w-full h-full flex flex-col items-center justify-between pt-[90px]">
      <div className="flex flex-col items-center gap-4 max-w-[240px]">
        <h1 className="text-hero">가입이 완료됐어요!</h1>
        <p className="text-body1 text-center">
          <span className="text-bold">&quot;SOSO&quot;</span>의{' '}
          {userType}
          <RandomTextSpan
            options={words}
            targetText={targetText}
            className="min-w-[10ch]" // 가장 긴 텍스트 기준 폭 확보
          />
          님의 앞날을 응원할게요!
        </p>
      </div>
      <div className="flex-1 w-full flex justify-center items-center">
        <CompleteImg />
      </div>
      <Button
        isLoading={isPending}
        className="w-full"
        onClick={handleButtonClick}
      >
        SOSO 시작하기
      </Button>
    </div>
  );
}
