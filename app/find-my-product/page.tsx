import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SkinQuiz } from "@/components/quiz/SkinQuiz";

export default function FindMyProductPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full bg-softpink/50 px-3 py-1 text-xs font-medium text-pink-700">
            ✦ 4 quick questions
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-textdark">
            Find My Product
          </h1>
          <p className="mt-2 text-textgray">
            Answer 4 questions and we&apos;ll recommend the best products for your skin.
          </p>
        </div>
        <SkinQuiz />
      </main>
      <SiteFooter />
    </>
  );
}
