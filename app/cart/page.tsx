import { MOCK_PRODUCTS, MOCK_BRANDS } from "@/lib/mock-data";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { CartClient } from "@/components/cart/CartClient";

export const metadata = {
  title: "My Bag — Lumière",
  description: "Review your bag and continue to checkout.",
};

export default function CartPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />
      <CartClient products={MOCK_PRODUCTS} brands={MOCK_BRANDS} />
      <HomeFooter />
    </>
  );
}
