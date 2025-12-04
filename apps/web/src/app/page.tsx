import LogoImage from '@/assets/images/LogoImage';
import StartButton from '@/app/(auth)/components/StartButton';

export default function HomePage() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-between pt-40">
      <h1 className="text-2xl font-semibold animate-fadeIn text-neutral-900 dark:text-neutral-100">
        소소에 오신 것을 환영합니다
      </h1>
      <div className="w-full h-full p-layout flex animate-fadeIn flex-col items-center justify-between space-y-4">
        <div className="flex-1 flex items-center justify-center">
          <LogoImage />
        </div>

        <div className="w-full gap-4 flex flex-col items-center">
          <p className="text-neutral-600 animate-pulse dark:text-neutral-400 text-sm">
            일상의 소소한 순간들을 기록해보세요
          </p>
          <StartButton className="w-full">소소 시작하기</StartButton>
        </div>
      </div>
    </div>
  );
}
