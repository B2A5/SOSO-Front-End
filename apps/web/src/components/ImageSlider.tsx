'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

interface ImageSliderProps {
  images: string[];
  className?: string;
}

export default function ImageSlider({
  images,
  className,
}: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 8,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const goToSlide = (index: number) => {
    instanceRef.current?.moveToIdx(index);
  };

  return (
    <div className={twMerge('w-full', className)}>
      <div
        ref={sliderRef}
        className="keen-slider rounded-lg overflow-hidden"
      >
        {images.map((url, index) => (
          <div key={index} className="keen-slider__slide">
            <Image
              src={url}
              alt={`슬라이드 이미지 ${index + 1}`}
              width={600}
              height={200}
              className="w-full h-[200px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* 페이지네이션 버튼 */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-[12px]">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={twMerge(
                'w-1.5 h-1.5 rounded-full bg-neutral-300',
                currentSlide === index && 'bg-soso-600',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
