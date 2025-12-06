'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/buttons/Button';
import CompleteImg from './components/CompleteImg';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
  useSaveNickname,
  useCompleteSignup,
} from '@/generated/api/endpoints/signup/signup';
import { useSignupFlow } from '@/hooks/useSignupFlow';
import { MotionSlotMachineText } from '@/components/MotionSlotMachineText';
import { SignupCompleteResponse } from '@/generated/api/models';
import { User } from '@/types/user.types';

export default function SignUpCompletePage() {
  const router = useRouter();
  const { login } = useAuth();
  const { userType } = useSignupFlow();
  const userTypeLabel =
    userType === 'FOUNDER' ? '예비 창업자' : '주민';
  const [nickname, setNickname] = useState<string | null>(null);
  const words = [
    '행복한문어',
    '쓸쓸한문어',
    '화려한문어',
    '장미를든문어',
    '귀여운문어',
    '재잘거리는문어',
  ];

  // 회원가입 완료 후 로그인 및 리다이렉트 처리
  const handleSuccess = (user: User) => {
    login(user);
    console.log('회원가입 및 로그인 완료:', { nickname });
    router.replace('/main');
  };

  // 회원가입 완료 API 호출
  const { mutate: completeSignup, isPending: isCompletingSignup } =
    useCompleteSignup({
      mutation: {
        onSuccess: (data: SignupCompleteResponse) => {
          if (data) {
            handleSuccess(data.user);
          } else {
            console.error('닉네임 또는 토큰 정보가 없습니다.');
          }
        },
        onError: (error) => {
          console.error('회원가입 완료 실패:', error);
        },
      },
    });

  // 닉네임 생성 API 호출
  const { mutate: getNickname, isPending: isGeneratingNickname } =
    useSaveNickname({
      mutation: {
        onSuccess: (data) => {
          setNickname(data);
          console.log('닉네임 생성 완료:', data);
        },
        onError: (error) => {
          console.error('닉네임 생성 실패:', error);
        },
      },
    });

  // "SOSO 시작하기" 버튼 클릭
  const handleButtonClick = () => {
    if (!nickname) {
      console.error('닉네임이 생성되지 않았습니다.');
      return;
    }
    completeSignup();
  };

  // 마운트 시 닉네임 자동 생성
  useEffect(() => {
    getNickname();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between pt-[90px]">
      <div className="flex flex-col items-center gap-4 max-w-[300px] w-full">
        <h1 className="text-hero dark:text-white">
          가입이 완료됐어요!
        </h1>
        <p className="text-body1 text-center dark:text-white">
          &quot;SOSO&quot;의 {userTypeLabel}
          <MotionSlotMachineText
            options={words}
            targetText={nickname!}
          />
          님의 <br />
          앞날을 응원할게요!
        </p>
      </div>
      <div className="flex-1 w-full flex justify-center items-center">
        <CompleteImg />
      </div>
      <Button
        isLoading={isGeneratingNickname || isCompletingSignup}
        disabled={!nickname}
        className="w-full animate-pulse"
        onClick={handleButtonClick}
      >
        SOSO 시작하기
      </Button>
    </div>
  );
}
