import Image from "next/image";

type AuthStudentIllustrationProps = {
  alt?: string;
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
};

export default function AuthStudentIllustration({
  alt = "Student using Smart Expense",
  imageSrc = "/student2.png",
  imageWidth = 1040,
  imageHeight = 1120,
}: AuthStudentIllustrationProps) {
  return (
    <section className="pointer-events-none relative hidden w-full items-center justify-center self-stretch lg:flex">
      <div className="relative flex min-h-[420px] w-full max-w-[600px] items-center justify-center lg:min-h-[520px] xl:min-h-[560px]">
        <div className="absolute left-1/2 top-2 bottom-[-32px] flex w-[58%] -translate-x-1/2 flex-col items-center">
          <div className="h-[170px] w-full rounded-t-[240px] bg-[#e5e5e5]" />
          <div className="w-full flex-1 bg-[#e5e5e5]" />
        </div>
        <Image
          src={imageSrc}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          className="relative z-10 h-auto w-full max-w-[560px] object-contain"
          priority
        />
      </div>
    </section>
  );
}
