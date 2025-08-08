'use client';

import 'keen-slider/keen-slider.min.css';
import {
  useKeenSlider,
  type KeenSliderInstance,
} from 'keen-slider/react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useMemo, useState } from 'react';

/**
 * ImageSliderProps - 이미지 슬라이더 컴포넌트의 props
 * @property {string[]} images - 슬라이드에 표시할 이미지 URL 배열
 * @property {string} [className] - 외부에서 전달할 추가 클래스 이름
 */
interface ImageSliderProps {
  images: string[];
  className?: string;
}

// url과 UUID를 함께 담는 타입 정의
interface SliderImage {
  url: string;
  id: string;
}

export default function ImageSlider({
  images,
  className,
}: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // images prop을 한 번만 매핑해서 id 부여
  const [sliderImages] = useState<SliderImage[]>(() =>
    images.map((url) => ({
      url,
      id: crypto.randomUUID(),
    })),
  );

  const sliderOptions = useMemo(
    () => ({
      loop: true,
      drag: true,
      slides: {
        perView: 1,
        spacing: 8,
      },
      created() {
        setLoaded(true);
      },
      slideChanged(slider: KeenSliderInstance) {
        setCurrentSlide(slider.track.details.rel);
      },
    }),
    [],
  );

  const [sliderRef, instanceRef] =
    useKeenSlider<HTMLDivElement>(sliderOptions);

  const goToSlide = (index: number) => {
    instanceRef.current?.moveToIdx(index);
  };

  return (
    <div className={twMerge('w-full relative', className)}>
      {/* 스켈레톤 로딩 */}
      <div
        className={twMerge(
          'absolute inset-0 h-[200px] md:h-[300px] rounded-lg bg-neutral-100 animate-pulse transition-opacity duration-300',
          loaded && 'opacity-0 pointer-events-none',
        )}
      />

      {/* 슬라이더 */}
      <div
        ref={sliderRef}
        className={twMerge(
          'keen-slider rounded-lg overflow-hidden transition-opacity duration-300',
          !loaded
            ? 'opacity-0 scale-95 translate-y-2'
            : 'opacity-100 scale-100 translate-y-0',
        )}
      >
        {sliderImages.map((img) => (
          <div
            key={img.id}
            className="keen-slider__slide relative h-[200px] md:h-[300px]"
          >
            <Image
              src={img.url}
              alt="슬라이드 이미지"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="w-full h-[200px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-2 mt-[12px] min-h-[12px] transition-opacity duration-500">
        {sliderImages.length > 1 &&
          sliderImages.map((_, idx) => (
            <button
              key={sliderImages[idx].id}
              onClick={() => goToSlide(idx)}
              className={twMerge(
                'w-1.5 h-1.5 rounded-full bg-neutral-300 transition-all duration-300',
                currentSlide === idx && 'bg-soso-600',
                !loaded
                  ? 'opacity-0 pointer-events-none scale-75'
                  : 'opacity-100 scale-100',
              )}
            />
          ))}
      </div>
    </div>
  );
}
