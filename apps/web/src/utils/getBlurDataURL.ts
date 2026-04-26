import 'server-only';
import sharp from 'sharp';

interface GetBlurDataURLOptions {
  size?: number; // 축소할 최대 가로/세로 크기
  blur?: number; // 블러 강도 (숫자가 클수록 강해짐)
  quality?: number; // webp 품질 (1-100)
}

/**
 * 이미지 URL로부터 블러 처리된 데이터 URL 생성
 *
 * @param imageUrl 원본 이미지 URL
 * @param options 블러 생성 옵션
 * @returns 블러 처리된 데이터 URL 또는 실패 시 undefined
 */
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
    const output = await sharp(input, { failOn: 'none' })
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
