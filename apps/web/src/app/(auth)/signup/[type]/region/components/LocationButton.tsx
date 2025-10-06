'use client';
import { twMerge } from 'tailwind-merge';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { DaumPostcodeResponse } from '@/types/daumPostcode.types';
import { MapPin } from 'lucide-react';
/**
 * 주소 검색 버튼 컴포넌트
 * 인풋처럼 보이지만 버튼 역할을 하는 컴포넌트
 * 클릭하면 다음 주소 검색 페이지로 이동
 * 주소 선택 후 onAddressSelect 콜백 함수 호출
 * 선택된 주소는 selectedAddress로 표시
 */

export interface AddressSet {
  address: string;
  sigunguCode: string;
}

export function LocationButton({
  onAddressSelect,
  selectedAddress,
}: {
  onAddressSelect: (address: AddressSet) => void;
  selectedAddress: string | null;
}) {
  const open = useDaumPostcodePopup(
    'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
  );

  const handleComplete = (data: DaumPostcodeResponse) => {
    let fullAddress = data.address || '';
    let extraAddress = '';
    const sigunguCode = data.sigunguCode || '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== ''
            ? `, ${data.buildingName}`
            : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    onAddressSelect({
      address: fullAddress,
      sigunguCode: sigunguCode,
    }); // 주소 선택 후 콜백 함수 호출
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };
  const LayoutClass = ' h-11 px-5 py-3 flex items-center';
  const StyleClass =
    'bg-white dark:bg-neutral-800 ring dark:ring-neutral-600 hover:ring-soso-600 active:ring-soso-600 rounded-full justify-between';
  const SelectedClass = selectedAddress
    ? 'text-black dark:text-white'
    : 'text-input1 text-neutral-200 dark:text-neutral-400 hover:text-neutral-400 active:text-neutral-700';
  return (
    <button
      className={twMerge(LayoutClass, StyleClass, SelectedClass)}
      onClick={handleClick}
    >
      <MapPin className="stroke-current w-5 h-5" />
      <p className="flex-1 ">
        {selectedAddress ?? '동명(읍,면) 으로 검색 (ex.삼성동)'}
      </p>
      <div />
    </button>
  );
}
