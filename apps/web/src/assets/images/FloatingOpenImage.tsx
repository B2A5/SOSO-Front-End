import Image from 'next/image';

export default function FloatingOpenImage() {
  return (
    <div className="flex justify-center">
      <Image
        src={'/icons/floating-open-icon.svg'}
        alt="플로팅 버튼 열기 아이콘"
        width={24}
        height={24}
        className="fade-In"
      />
    </div>
  );
}
