import { twMerge } from 'tailwind-merge';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { DaumPostcodeResponse } from '@/types/daumPostcode.types';
// 인풋처럼 보이지만 버튼 역할을 하는 컴포넌트
// 클릭하면 다음 주소 검색 페이지로 이동

export function LocationButton({
  onAddressSelect,
}: {
  onAddressSelect: (address: string) => void;
}) {
  const open = useDaumPostcodePopup(
    'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
  );

  const handleComplete = (data: DaumPostcodeResponse) => {
    let fullAddress = data.address || '';
    let extraAddress = '';

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

    onAddressSelect(fullAddress); // 주소 선택 후 콜백 함수 호출
    console.log(fullAddress);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };
  const LayoutClass = 'max-w-[200px] w-full h-11 px-5 py-3 flex';
  const StyleClass =
    'bg-white hover:ring-soso-600 active:ring-soso-600 rounded-full';
  return (
    <button
      className={twMerge(LayoutClass, StyleClass)}
      onClick={handleClick}
    >
      <svg className="fill-neutral-200 hover:fill-neutral-400 active:fill-neutral-700 w-5 h-5">
        <use href="icons/LocationIcon.svg" />
      </svg>
      <span className="text-input1 text-neutral-200 hover:text-neutral-400 active:text-neutral-700">
        동명(읍,면) 으로 검색 (ex.삼성동)
      </span>
    </button>
  );
}
