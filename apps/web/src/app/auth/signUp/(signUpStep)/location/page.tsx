import Button from '@/components/buttons/Button';

export default function LocationPage() {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className=" pt-12 w-full h-full flex flex-col gap-[30px]">
        <h1 className=" text-header1">지역을 선택해 주세요</h1>
        <p>인풋 들어감</p>
        <div className="flex-1" />
      </div>

      <Button className="w-full mb-2" variant="ghost" size="lg">
        다음
      </Button>
    </div>
  );
}
