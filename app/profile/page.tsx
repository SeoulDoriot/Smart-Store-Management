import { MOCK_PRODUCTS, MOCK_BRANDS } from "@/lib/mock-data";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { FloatingAIButton } from "@/components/home/FloatingAIButton";
import { ProfileClient } from "@/components/profile/ProfileClient";

// Wishlist: 8 products Ava has saved
const WISHLIST_IDS = ["p3", "p4", "p5", "p6", "p9", "p10", "p1", "p8"];

// AI recommendations: oily + acne focused products
const RECOMMENDED_IDS = ["p1", "p2", "p7"];

export const metadata = {
  title: "My Profile — Lumière",
  description: "Manage your Lumière account, orders, wishlist, and skin profile.",
};

export default function ProfilePage() {
  const wishlistProducts = MOCK_PRODUCTS.filter((p) =>
    WISHLIST_IDS.includes(p.id)
  );
  const recommendedProducts = MOCK_PRODUCTS.filter((p) =>
    RECOMMENDED_IDS.includes(p.id)
  );

  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />

      <ProfileClient
        wishlistProducts={wishlistProducts}
        recommendedProducts={recommendedProducts}
        brands={MOCK_BRANDS}
      />

      <HomeFooter />
      <FloatingAIButton />
    </>
  );
}
