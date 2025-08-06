'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/ui/useToast';

interface ImageInputProps {
  onFileSelect?: (files: File[]) => void;
}

/**
 * ImageInput - 다중 이미지 업로드 컴포넌트
 *
 * - 최대 4장까지 이미지 업로드 가능
 * - 이미지 선택 시 미리보기로 표시
 * - 같은 파일 다시 선택해도 반응
 */
export function ImageInput({ onFileSelect }: ImageInputProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  // 이미지 → 미리보기 URL 생성
  useEffect(() => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    const newUrls = images
      .filter((file): file is File => file instanceof File)
      .map((file) => URL.createObjectURL(file));

    setPreviewUrls(newUrls);
  }, [images]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).filter(
      (file): file is File => file instanceof File,
    );

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
    ];
    const allValid = files.every((file) =>
      allowedTypes.includes(file.type),
    );

    if (!allValid) {
      toast('지원하지 않는 파일 형식입니다.', 'error');
      e.target.value = '';
      return;
    }

    const total = images.length + files.length;
    if (total > 4) {
      toast('이미지는 최대 4장까지만 업로드할 수 있어요.', 'error');
      e.target.value = '';
      return;
    }

    const newImages = [...images, ...files].slice(0, 4);
    setImages(newImages);
    onFileSelect?.(newImages);
    e.target.value = ''; // 같은 파일 다시 선택 가능하도록 초기화
  };

  const handleFileRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(images.length - 1 - index, 1); // reverse된 index 고려

    const removedUrl = previewUrls[index];
    if (removedUrl) {
      URL.revokeObjectURL(removedUrl);
    }

    setImages(newImages);
    onFileSelect?.(newImages);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      {/* 이미지 추가 버튼 (항상 렌더링, 4장일 때는 disabled 스타일 + 클릭 방지) */}
      <div
        onClick={() => {
          if (images.length >= 4) return;
          handleImageClick();
        }}
        className={`w-20 h-20 rounded-[10px] flex items-center justify-center transition 
      ${
        images.length >= 4
          ? 'bg-gray-100 cursor-not-allowed opacity-50'
          : 'bg-light-gray hover:bg-gray-200 cursor-pointer'
      }`}
      >
        <Plus className="w-6 h-6 text-neutral-200" />
      </div>

      <input
        type="file"
        accept=".png, .jpg, .jpeg, .webp, .gif"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        multiple
      />

      {/* 미리보기 이미지 영역 */}
      <div className="flex gap-2 flex-wrap justify-start items-start">
        {previewUrls
          .slice()
          .reverse()
          .map((url, idx) => (
            <div
              key={idx}
              className="w-20 h-20 rounded-[10px] relative"
            >
              <img
                src={url}
                alt={`미리보기 ${idx + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleFileRemove(idx)}
                className="absolute -top-1 -right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
