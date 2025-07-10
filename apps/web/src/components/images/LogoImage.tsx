import Image from 'next/image';

export default function LogoImage() {
  return (
    <div className="max-w-[150px] w-full">
      <Image src={'/icons/Logo.svg'} alt="SOSO 로고" fill className="h-full h-auto" />
    </div>
  );
}
