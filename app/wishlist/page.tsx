import { MOCK_PRODUCTS, MOCK_BRANDS } from "@/lib/mock-data";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { FloatingAIButton } from "@/components/home/FloatingAIButton";
import { WishlistClient } from "@/components/wishlist/WishlistClient";

export const metadata = {
  title: "Wishlist — Lumière",
  description: "Your saved products on Lumière.",
};

export default function WishlistPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />
      <WishlistClient products={MOCK_PRODUCTS} brands={MOCK_BRANDS} />
      <HomeFooter />
      <FloatingAIButton />
    </>
  );
}
