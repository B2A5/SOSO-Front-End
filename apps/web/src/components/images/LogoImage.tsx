import Image from 'next/image';

export default function LogoImage() {
  return (
    <div className="flex justify-center w-full max-w-[150px] p-2">
      <Image
        src={'/icons/Logo.svg'}
        alt="SOSO 로고"
        width={150}
        height={150}
        className="w-full h-auto"
        sizes="150px"
      />
    </div>
  );
}
