'use client';

import { useRouter, usePathname } from 'next/navigation';
import Modal from './Modal';

interface LoginRedirectOverlayProps {
  // useOverlay.open()에서 내려주는 close 함수
  // - result: 호출 쪽에 resolve로 넘겨줄 값
  // - options: fadeOut 여부, 애니메이션 duration(ms)
  close: (
    result: boolean,
    options?: {
      fadeOut?: boolean;
      duration?: number;
    },
  ) => void;
}

/**
 * 비로그인 상태에서 행동 시 띄우는 "로그인 리다이렉트" 오버레이
 *
 * - 전체 화면을 fixed로 덮고 가운데에 Modal을 띄운다
 * - 배경을 클릭했을 때는 클릭이 통과되도록 pointer-events 설정
 * - 버튼 클릭 시에만 실제 클릭 이벤트가 동작하도록 분리
 */
export function LoginRedirectOverlay({
  close,
}: LoginRedirectOverlayProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 취소: 로그인 페이지로 이동하지 않고 모달만 닫기
  const handleCancel = () => {
    close(false, { fadeOut: true, duration: 300 });
  };

  // 확인: 로그인 페이지로 이동 + 모달 닫기
  // - 현재 경로(pathname)를 returnTo로 넘겨서 로그인 후 되돌아올 수 있게 함
  const handleConfirm = () => {
    const returnTo = encodeURIComponent(pathname || '/');
    router.push(`/login?returnTo=${returnTo}`);
    close(true, { fadeOut: true, duration: 300 });
  };

  return (
    // 전체 화면을 덮는 오버레이 레이어
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      {/* 실제 인터랙션이 일어나는 영역만 pointer-events 활성화 */}
      <Modal
        isOpen
        onClose={handleCancel}
        className="relative pointer-events-auto"
      >
        {/* 모달 내부 레이아웃: 수직 정렬 + 여백 */}
        <div className="flex flex-col gap-4 w-full h-full">
          <h2 className="text-lg font-semibold text-center">
            로그인이 필요합니다
          </h2>

          <p className="text-sm text-center text-gray-500">
            로그인이 필요한 기능이에요.
            <br />
            로그인하러 이동할까요?
          </p>

          {/* 버튼 영역: 가운데 정렬, 버튼 간 간격 */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300"
              onClick={handleCancel}
            >
              취소
            </button>

            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-lg bg-primary text-white"
              onClick={handleConfirm}
            >
              로그인하러 가기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
