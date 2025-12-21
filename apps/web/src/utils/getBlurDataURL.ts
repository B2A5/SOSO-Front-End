import 'server-only';
import sharp from 'sharp';

interface GetBlurDataURLOptions {
  size?: number;
  blur?: number;
  quality?: number;
}

export async function getBlurDataURL(
  imageUrl: string,
  { size = 10, blur = 5, quality = 30 }: GetBlurDataURLOptions = {},
): Promise<string | undefined> {
  try {
    const res = await fetch(imageUrl, { cache: 'force-cache' });
    if (!res.ok)
      throw new Error(`Failed to fetch image: ${imageUrl}`);

    const arrayBuf = await res.arrayBuffer();
    const input = Buffer.from(arrayBuf);

    // 1. 디코딩(버퍼 -> 이미지)
    // 2. 리사이즈
    // 3. 블러 + 포맷 지정
    // 4. 다시 버퍼로 인코딩
    const output = await sharp(input)
      .rotate() // EXIF 기반 자동 회전
      .resize(size, size, { fit: 'inside' })
      .blur(blur)
      .webp({ quality: quality })
      .toBuffer();

    return `data:image/webp;base64,${output.toString('base64')}`;
  } catch (e) {
    console.error('[blur] generation failed:', e);
    return undefined;
  }
}
