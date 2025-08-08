'use client';

import React, { useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/ui/useToast';

interface ImageInputProps {
  onFileSelect?: (files: File[]) => void;
}

interface ImageItem {
  file: File;
  preview: string;
  id: string;
}
/**
 * ImageInput - 다중 이미지 업로드 컴포넌트
 *
 * - 최대 4장까지 이미지 업로드 가능
 * - 이미지 선택 시 미리보기로 표시
 * - 같은 파일 다시 선택해도 반응
 */
export function ImageInput({ onFileSelect }: ImageInputProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

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

    // File -> ImageItem으로 매핑
    const items = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // 미리보기 URL 생성
      id: crypto.randomUUID(), // 고유 ID 생성
    }));

    // 최대 4장 제한 + onFileSelect에 File[]만 전달
    setImages((prev) => {
      const merged = [...prev, ...items].slice(0, 4);
      onFileSelect?.(merged.map((item) => item.file));
      return merged;
    });

    e.target.value = ''; // 같은 파일 다시 선택 가능
  };

  const handleFileRemove = (removeId: string) => {
    setImages((prev) => {
      const filtered = prev.filter((item) => item.id !== removeId);
      onFileSelect?.(filtered.map((item) => item.file));
      return filtered;
    });
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
        {images
          .slice()
          .reverse()
          .map((item) => (
            <div
              key={item.id}
              className="w-20 h-20 rounded-[10px] relative"
            >
              <img
                src={item.preview}
                alt={`미리보기`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleFileRemove(item.id)}
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
