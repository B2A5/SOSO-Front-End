'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/ui/useToast';
import type { ImageInfo } from '@/generated/api/models';

/**
 * 애니메이션 상수
 */
const IMAGE_ANIMATION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.2 },
} as const;

const BUTTON_HOVER = { scale: 1.1 } as const;
const BUTTON_TAP = { scale: 0.9 } as const;

/**
 * 새로 추가한 이미지 (파일 업로드)
 */
interface NewImage {
  file: File;
  preview: string;
  id: string;
}

interface ImageUploaderProps {
  /** 기존 이미지 목록 (수정 모드에서 사용) */
  initialImages?: ImageInfo[];
  /** 새 이미지 파일 선택 시 콜백 */
  onFileSelect?: (files: File[]) => void;
  /** 기존 이미지 삭제 시 콜백 (삭제된 이미지 ID 목록) */
  onDeleteExisting?: (deletedIds: number[]) => void;
  /** 최대 이미지 개수 */
  maxImages?: number;
}

/**
 * ImageUploader - 다중 이미지 업로드 및 관리 컴포넌트
 *
 * @description
 * 기존 이미지(ImageInfo)와 새 이미지(File)를 함께 관리하는 컴포넌트입니다.
 * 게시글 생성 시에는 새 이미지만, 수정 시에는 기존 이미지도 표시합니다.
 *
 * @remarks
 * - 최대 4장까지 이미지 업로드 가능 (기존 + 새 이미지 합산)
 * - 기존 이미지 삭제 시 deleteImageIds에 추가
 * - 새 이미지 선택 시 미리보기로 표시
 * - framer-motion으로 자연스러운 애니메이션 제공
 */
export function ImageUploader({
  initialImages = [],
  onFileSelect,
  onDeleteExisting,
  maxImages = 4,
}: ImageUploaderProps) {
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>(
    [],
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newImagesRef = useRef<NewImage[]>([]);
  const toast = useToast();

  // 최신 newImages를 ref에 동기화
  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  // 삭제되지 않은 기존 이미지만 필터링 (useMemo로 최적화)
  const existingImages = useMemo(
    () =>
      initialImages.filter(
        (img) => !deletedImageIds.includes(img.imageId),
      ),
    [initialImages, deletedImageIds],
  );

  const totalImageCount = existingImages.length + newImages.length;

  // Cleanup: 컴포넌트 언마운트 시 모든 preview URL 해제
  useEffect(() => {
    return () => {
      // ref를 통해 최신 newImages 참조
      newImagesRef.current.forEach((item) => {
        URL.revokeObjectURL(item.preview);
      });
    };
  }, []);

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

    // 최대 제한 검증
    const total = totalImageCount + files.length;
    if (total > maxImages) {
      toast(
        `이미지는 최대 ${maxImages}장까지만 업로드할 수 있어요.`,
        'error',
      );
      e.target.value = '';
      return;
    }

    // File -> NewImage로 매핑
    const items: NewImage[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));

    // 새 이미지 추가
    setNewImages((prev) => {
      const merged = [...prev, ...items];
      const limited = merged.slice(
        0,
        maxImages - existingImages.length,
      );
      onFileSelect?.(limited.map((item) => item.file));
      return limited;
    });

    e.target.value = '';
  };

  // 새 이미지 삭제
  const handleNewImageRemove = (removeId: string) => {
    setNewImages((prev) => {
      // 삭제할 이미지의 preview URL 해제
      const toRemove = prev.find((item) => item.id === removeId);
      if (toRemove) {
        URL.revokeObjectURL(toRemove.preview);
      }

      const filtered = prev.filter((item) => item.id !== removeId);
      onFileSelect?.(filtered.map((item) => item.file));
      return filtered;
    });
  };

  // 기존 이미지 삭제
  const handleExistingImageRemove = (imageId: number) => {
    setDeletedImageIds((prev) => {
      const updated = [...prev, imageId];
      onDeleteExisting?.(updated);
      return updated;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 이미지 개수 정보 (스크린 리더용) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {totalImageCount}개의 이미지가 선택되었습니다. 최대{' '}
        {maxImages}개까지 업로드 가능합니다.
      </div>

      {/* 이미지 컨테이너 (가로 스크롤) */}
      <div className="flex gap-2 overflow-x-auto p-2 pl-0">
        <label htmlFor="image-upload" className="sr-only">
          이미지 파일 선택
        </label>
        <input
          id="image-upload"
          type="file"
          accept=".png, .jpg, .jpeg, .webp, .gif"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          multiple
          aria-label="이미지 파일 선택"
        />

        {/* 이미지 목록 (애니메이션) */}
        <AnimatePresence mode="popLayout">
          {/* 이미지 추가 버튼 - 4장 미만일 때만 표시 */}
          {totalImageCount < maxImages && (
            <motion.button
              type="button"
              key="add-button"
              layout
              {...IMAGE_ANIMATION}
              onClick={handleImageClick}
              aria-label={`이미지 추가 (${totalImageCount}/${maxImages})`}
              className="flex-shrink-0 w-20 h-20 rounded-[10px] flex items-center justify-center bg-light-gray hover:bg-gray-200 cursor-pointer transition focus:outline-none focus-visible:ring-2 focus-visible:ring-soso-500"
              whileTap={{ scale: 0.95 }}
            >
              <Plus
                className="w-6 h-6 text-neutral-200"
                aria-hidden="true"
              />
            </motion.button>
          )}
          {/* 기존 이미지 (서버에서 받은 이미지) */}
          {existingImages
            .sort((a, b) => a.sequence - b.sequence)
            .map((image, index) => (
              <motion.div
                key={`existing-${image.imageId}`}
                layout
                {...IMAGE_ANIMATION}
                className="flex-shrink-0 w-20 h-20 rounded-[10px] relative"
              >
                <img
                  src={image.imageUrl}
                  alt={`업로드된 이미지 ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <motion.button
                  type="button"
                  onClick={() =>
                    handleExistingImageRemove(image.imageId)
                  }
                  aria-label={`이미지 ${index + 1} 삭제`}
                  className="absolute -top-1 -right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 cursor-pointer z-10 focus:outline-none focus:ring-2 focus:ring-white"
                  whileHover={BUTTON_HOVER}
                  whileTap={BUTTON_TAP}
                >
                  <X size={12} aria-hidden="true" />
                </motion.button>
              </motion.div>
            ))}

          {/* 새로 추가한 이미지 (파일 업로드) */}
          {newImages.map((item, index) => (
            <motion.div
              key={`new-${item.id}`}
              layout
              {...IMAGE_ANIMATION}
              className="flex-shrink-0 w-20 h-20 rounded-[10px] relative"
            >
              <img
                src={item.preview}
                alt={`새로 선택한 이미지 ${existingImages.length + index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
              <motion.button
                type="button"
                onClick={() => handleNewImageRemove(item.id)}
                aria-label={`이미지 ${existingImages.length + index + 1} 삭제`}
                className="absolute -top-1 -right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 cursor-pointer z-10 focus:outline-none focus:ring-2 focus:ring-white"
                whileHover={BUTTON_HOVER}
                whileTap={BUTTON_TAP}
              >
                <X size={12} aria-hidden="true" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
