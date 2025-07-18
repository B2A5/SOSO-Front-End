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
        'relative flex items-center justify-center max-w-[375px]',
        className,
      )}
    >
      <Image
        src="/somoon/complete_background.svg"
        alt="가입 완료 이미지 배경"
        width="375"
        height="200"
        className="absolute object-contain"
      />
      <Image
        src="/somoon/complete_somoon.svg"
        alt="가입 완료 이미지"
        width="375"
        height="200"
        className="absolute object-contain"
      />
    </div>
  );
}
