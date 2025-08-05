'use client';

import React, { useRef, useState } from 'react';

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
  // 선택된 이미지 파일 배열 상태
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  /** 파일이 선택되었을 때 실행되는 핸들러 */
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;

    // 선택된 파일들을 배열로 변환
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files].slice(0, 4);
    setImages(newImages);

    // 같은 파일을 다시 선택할 수 있도록 input 초기화
    e.target.value = '';

    onFileSelect?.(newImages);
  };

  return (
    <div className="flex items-start gap-2">
      {/* "이미지 추가" 버튼 (이미지가 4개 미만일 때만 표시) */}
      {images.length < 4 && (
        <div
          onClick={handleImageClick}
          className="w-[100px] h-[100px] bg-gray-100 rounded-md cursor-pointer flex items-center justify-center"
        >
          <span className="text-gray-500 text-sm">이미지 추가</span>
        </div>
      )}

      {/* 실제 파일 업로드 input (숨겨짐) */}
      <input
        type="file"
        accept=".png, .jpg, .jpeg, .webp"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        multiple
      />

      {/* 미리보기 썸네일 영역 */}
      <div className="flex gap-2 flex-wrap justify-start">
        {images
          .slice()
          .reverse()
          .map((file, idx) => {
            // 브라우저에서 파일 미리보기를 위한 URL 생성
            const url = URL.createObjectURL(file);

            return (
              <div key={idx} className="w-24 h-24 relative">
                <img
                  src={url}
                  alt={`미리보기 ${idx + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
