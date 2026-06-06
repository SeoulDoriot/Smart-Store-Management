import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { FloatingAIButton } from "@/components/home/FloatingAIButton";
import { OrderForm } from "@/components/order/OrderForm";

export const metadata = {
  title: "Place an Order — Lumière",
  description: "Order your beauty products from Lumière — confirmed via Telegram.",
};

export default function OrderPage({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />

      <main className="min-h-screen bg-[#FAFAF7]">
        <div className="mx-auto max-w-xl px-4 py-10">
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-textgray">
              Checkout
            </p>
            <h1 className="mt-2 font-serif text-3xl font-normal text-[#111111]">
              Place an Order
            </h1>
            <p className="mt-1.5 text-sm text-textgray">
              Fill in your details and we&apos;ll confirm your order via Telegram.
            </p>
          </div>
          <OrderForm defaultProduct={searchParams.product} />
        </div>
      </main>

      <HomeFooter />
      <FloatingAIButton />
    </>
  );
}
