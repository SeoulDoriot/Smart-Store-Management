import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { FloatingAIButton } from "@/components/home/FloatingAIButton";
import { TrackOrderForm } from "@/components/order/TrackOrderForm";

export const metadata = {
  title: "Track Order — Lumière",
  description: "Track your Lumière order status in real time.",
};

export default function TrackOrderPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />

      <main className="min-h-screen bg-[#FAFAF7]">
        <div className="mx-auto max-w-xl px-4 py-10">
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-textgray">
              Order Tracking
            </p>
            <h1 className="mt-2 font-serif text-3xl font-normal text-[#111111]">
              Track Your Order
            </h1>
            <p className="mt-1.5 text-sm text-textgray">
              Enter your Order ID and phone number to check your order status.
            </p>
          </div>
          <TrackOrderForm />
        </div>
      </main>

      <HomeFooter />
      <FloatingAIButton />
    </>
  );
}
