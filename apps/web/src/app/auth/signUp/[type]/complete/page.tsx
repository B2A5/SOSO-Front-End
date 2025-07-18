'use client';
import { Button } from '@/components/buttons/Button';
import { useParams } from 'next/navigation';
import { RandomTextSpan } from '@/components/RandomTextSpan';
import CompleteImg from './components/CompleteImg';

export default function SignUpCompletePage() {
  const params = useParams();
  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;
  const paramType = rawType?.toLowerCase();
  const userType = paramType === 'founder' ? '예비 창업자' : '주민';

  const words = [
    '행복한 문어',
    '쓸쓸한 문어',
    '화려한 문어',
    '슬픈 문어',
    '귀여운 문어',
  ];

  return (
    <div className="p-layout w-full h-full flex flex-col items-center justify-between pt-[90px]">
      <div className="flex flex-col items-center gap-4 max-w-[240px]">
        <h1 className="text-hero">가입이 완료됐어요!</h1>
        <p className="text-body1 text-center">
          <span className="text-soso-600 text-bold">
            &quot;SOSO&quot;
          </span>
          의 {userType}
          <RandomTextSpan
            options={words}
            targetText="행복한 문어"
            className="min-w-[10ch]" // 가장 긴 텍스트 기준 폭 확보
          />
          님의 앞날을 응원할게요!
        </p>
      </div>
      <div className="flex-1 w-full flex justify-center items-center">
        <CompleteImg />
      </div>
      <Button className="w-full ">SOSO 시작하기</Button>
    </div>
  );
}
