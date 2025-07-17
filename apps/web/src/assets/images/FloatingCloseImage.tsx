import Image from 'next/image';

export default function FloatingCloseImage() {
  return (
    <div className="flex justify-center">
      <Image
        src={'/icons/floating-close-icon.svg'}
        alt="플로팅 버튼 닫기 아이콘"
        width={20}
        height={20}
        className="fade-in"
      />
    </div>
  );
}
