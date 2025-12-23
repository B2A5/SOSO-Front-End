import React, { InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface RoundCheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  /** 체크박스 오른쪽에 표시할 라벨 텍스트 */
  label?: string;
}

/**
 * 동그란 디자인의 커스텀 체크박스
 *
 * - 비활성: 흰 배경, 뉴트럴 테두리, 뉴트럴 텍스트
 * - 활성: SOSO 메인 배경, 흰 아이콘, 검정 텍스트
 */
export const RoundCheckbox = React.forwardRef<
  HTMLInputElement,
  RoundCheckboxProps
>(function RoundCheckbox(
  { label, id, name, className, ...inputProps },
  ref,
) {
  const inputId = id ?? (typeof name === 'string' ? name : undefined);

  const boxClassName = twMerge(
    // 기본 모양
    'flex items-center justify-center w-4 h-4 rounded-full border transition-colors',
    // 비활성 상태
    'border-neutral-100 bg-white text-transparent',
    // 활성(체크) 상태
    'peer-checked:bg-soso-500 peer-checked:border-soso-500 peer-checked:text-white',
    // 포커스
    'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-soso-500',
  );

  return (
    <label
      htmlFor={inputId}
      className={twMerge(
        'inline-flex h-5 items-center gap-2 cursor-pointer text-sm leading-none',
        className,
      )}
    >
      {/* 실제 체크박스 */}
      <input
        id={inputId}
        name={name}
        type="checkbox"
        ref={ref}
        className="peer sr-only"
        {...inputProps}
      />

      {/* 커스텀 체크박스 */}
      <span className={boxClassName}>
        <Check className="w-3 h-3" />
      </span>

      {/* 라벨 텍스트 */}
      {label && <span className="text-neutral-900">{label}</span>}
    </label>
  );
});
