import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

export default function LogoImage({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div className="flex justify-center">
      <Image
        src={'/icons/Logo.svg'}
        alt="SOSO 로고"
        width={200}
        height={150}
        priority
        className={twMerge('w-[200px] h-auto', className)}
      />
    </div>
  );
}
