import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { FloatingAIButton } from "@/components/home/FloatingAIButton";
import { CouponsClient } from "@/components/coupons/CouponsClient";

export const metadata = {
  title: "My Coupons — Lumière",
  description: "Your saved event coupons from Lumière.",
};

export default function CouponsPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />

      <main className="min-h-screen bg-[#FAFAF7]">
        <div className="mx-auto max-w-xl px-4 py-10">
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-textgray">
              Rewards
            </p>
            <h1 className="mt-2 font-serif text-3xl font-normal text-[#111111]">
              My Coupons
            </h1>
            <p className="mt-1.5 text-sm text-textgray">
              Coupons you&apos;ve cut from your receipts are saved here.
            </p>
          </div>
          <CouponsClient />
        </div>
      </main>

      <HomeFooter />
      <FloatingAIButton />
    </>
  );
}
