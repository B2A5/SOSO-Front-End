import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
export default function CompleteImg({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'relative max-w-[375px] max-h-[250px] w-full h-full  flex items-center justify-center',
        className,
      )}
    >
      <Image
        src="/somoon/complete_background.svg"
        alt="가입 완료 이미지 배경"
        fill
        priority
        className="absolute object-cover animate-bgGrow"
      />
      <Image
        src="/somoon/complete_somoon.svg"
        alt="가입 완료 이미지"
        width="375"
        height="200"
        priority
        className="absolute object-cover top-16 h-auto w-auto"
      />
    </div>
  );
}
