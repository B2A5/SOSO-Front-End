// apps/web/src/components/icons/KakaoImage.tsx
'use client';

import Image, { ImageProps } from 'next/image';

/** alt(카카오 로고)만 기본 제공, 필요하면 덮어쓸 수 있음 */
type KakaoImageProps = Omit<
  ImageProps,
  'src' | 'alt'
> & {
  alt?: string;
};

export default function KakaoImage({
  width = 20,
  height = 20,
  priority = true,
  alt = '카카오 로고',
  ...rest
}: KakaoImageProps) {
  return (
    <Image
      src="/icons/kakao.svg"
      width={width}
      height={height}
      priority={priority}
      alt={alt}
      {...rest}
    />
  );
}
