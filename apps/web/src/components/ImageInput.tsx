'use client';

import { useToast } from '@/hooks/ui/useToast';
import { Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ImageInputProps {
  /** 선택된 이미지 파일들을 상위 컴포넌트로 전달 */
  onFileSelect?: (files: File[]) => void;
}

/**
 * ImageInput - 다중 이미지 업로드 컴포넌트
 *
 * - 최대 4장까지 이미지 업로드 가능
 * - 이미지 선택 시 미리보기로 표시됨
 * - 같은 파일을 다시 선택해도 반응함
 */
export function ImageInput({ onFileSelect }: ImageInputProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  /** 이미지 → 미리보기 URL 생성 후 상태 업데이트 */
  useEffect(() => {
    // 기존 URL 메모리 해제
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    // 새로운 이미지 파일들에 대한 미리보기 URL 생성
    const newUrls = images
      .filter((file): file is File => file instanceof File)
      .map((file) => URL.createObjectURL(file));

    setPreviewUrls(newUrls);

    // 컴포넌트 언마운트 시 URL 해제
    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  /** 파일이 선택되었을 때 실행되는 핸들러 */
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;

    // 파일 목록 → File[] 로 변환
    const files = Array.from(e.target.files).filter(
      (file): file is File => file instanceof File,
    );

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

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

    e.target.value = ''; // 같은 파일 다시 선택 가능하게 초기화
    onFileSelect?.(newImages);
  };

  return (
    <div className="flex items-start gap-2">
      {/* 이미지 추가 버튼 (4개 미만일 때만) */}
      {images.length < 4 && (
        <div
          onClick={handleImageClick}
          className="w-20 h-20 bg-light-gray rounded-[10px] cursor-pointer flex items-center justify-center"
        >
          <Plus className="w-6 h-6 text-neutral-200" />
        </div>
      )}

      {/* 실제 파일 input (숨김) */}
      <input
        type="file"
        accept=".png, .jpg, .jpeg, .webp"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        multiple
      />

      {/* 미리보기 영역 */}
      <div className="flex gap-2 flex-wrap justify-start">
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
            </div>
          ))}
      </div>
    </div>
  );
}
