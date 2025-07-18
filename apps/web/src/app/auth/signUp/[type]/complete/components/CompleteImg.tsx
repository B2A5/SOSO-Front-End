import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
export default function CompleteImg({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={twMerge('relative w-[375px] h-[250px]', className)}
    >
      <Image
        src="/somoon/complete_background.svg"
        alt="가입 완료 이미지 배경"
        width="375"
        height="200"
        className="absolute object-cover animate-fadeIn duration-700"
      />
      <Image
        src="/somoon/complete_somoon.svg"
        alt="가입 완료 이미지"
        width="375"
        height="200"
        className="absolute object-cover top-8"
      />
    </div>
  );
}
