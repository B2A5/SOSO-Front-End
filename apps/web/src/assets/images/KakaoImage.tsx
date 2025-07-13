// apps/web/src/components/icons/KakaoImage.tsx
'use client';

import Image, { ImageProps } from 'next/image';

/** alt(카카오 로고)만 기본 제공, 필요하면 덮어쓸 수 있음 */
type KakaoImageProps = Omit<
  ImageProps,
  'src' | 'alt' | 'width' | 'height'
> & {
  width?: number;
  height?: number;
  alt?: string; // 기본값만 제공, 덮어쓰기 가능
};

export default function KakaoImage({
  width = 20,
  height = 20,
  ...rest
}: KakaoImageProps) {
  return (
    <Image
      src="/icons/kakao.svg"
      width={width}
      height={height}
      alt="카카오 로고"
      {...rest}
    />
  );
}
