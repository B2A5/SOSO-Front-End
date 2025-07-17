'use client';
import React, { useState } from 'react';
import Button from '@/components/buttons/Button';
import { LocationButton } from './components/LocationButton';
import { useMutation } from '@tanstack/react-query';
import { postRegion } from '@/api/signup';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/ui/useToast';
export default function LocationPage() {
  const router = useRouter();
  const toast = useToast();
  const [address, setAddress] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: postRegion,
    onSuccess: () => {
      console.log('지역이 성공적으로 저장되었습니다.');
      router.push('/auth/signup/profiles');
    },
    onError: (error) => {
      console.error('지역 저장에 실패했습니다.', error);
      toast('서버 에러가 발생했습니다. 다시 시도해주세요.', 'error');
    },
  });
  //버튼에서 주소를 선택했을 때 호출되는 핸들러
  const handleAddressSelected = (address: string) => {
    setAddress(address);
  };
  // 다음 버튼 클릭 핸들러
  const handleNextButtonClick = () => {
    if (!address) {
      console.error('주소가 선택되지 않았습니다.');
      return;
    }
    mutate(address);
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className=" pt-12 w-full h-full flex flex-col gap-[30px]">
        <h1 className=" text-header1">
          {address
            ? '해당 지역이 맞으신가요?'
            : '지역을 선택해 주세요'}
        </h1>
        <LocationButton
          onAddressSelect={handleAddressSelected}
          selectedAddress={address}
        />
        <div className="flex-1" />
      </div>

      <Button
        className="w-full mb-2"
        variant="filled"
        size="lg"
        disabled={!address}
        isLoading={isPending}
        loadingText="로딩 중..."
        onClick={handleNextButtonClick}
      >
        다음
      </Button>
    </div>
  );
}
