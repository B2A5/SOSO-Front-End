import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
export function DefaultSomoon({ className }: { className?: string }) {
  return (
    <Image
      src="/somoon/default_somoon.svg"
      alt="Default Somoon"
      width={316}
      height={180}
      className={twMerge('object-cover', className)}
      priority
      draggable={false}
    />
  );
}
