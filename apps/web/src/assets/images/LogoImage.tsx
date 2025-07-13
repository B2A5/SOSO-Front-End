import Image from 'next/image';

export default function LogoImage() {
  return (
    <div className="flex justify-center">
      <Image
        src={'/icons/Logo.svg'}
        alt="SOSO 로고"
        width={200}
        height={150}
        className="h-auto"
      />
    </div>
  );
}
