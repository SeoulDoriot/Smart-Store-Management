import { getProducts, getBrands } from "@/lib/products";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HeroSection } from "@/components/home/HeroSection";
import { PromoProductStrip } from "@/components/home/PromoProductStrip";
import { ProductSection } from "@/components/home/ProductSection";
import { SkinGuideSection } from "@/components/home/SkinGuideSection";
import { BrandsSection } from "@/components/home/BrandsSection";
import { MenGroomingSection } from "@/components/home/MenGroomingSection";
import { AIAdvisorBanner } from "@/components/home/AIAdvisorBanner";
import { DigitalShelfTeaser } from "@/components/home/DigitalShelfTeaser";
import { TrustSection } from "@/components/home/TrustSection";
import { HomeFooter } from "@/components/home/HomeFooter";
import { FloatingAIButton } from "@/components/home/FloatingAIButton";

export default async function HomePage() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);

  const chosenForYou = products.filter((p) => p.is_ai_recommendable).slice(0, 8);
  const beautyOffers = products.filter((p) => p.is_hot_sale).slice(0, 8);
  const newArrivals = products.filter((p) => p.is_new_arrival).slice(0, 8);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />

      <main>
        <HeroSection />

        <PromoProductStrip products={products} brands={brands} />

        <ProductSection
          title="Chosen For You"
          subtitle="Personalized-looking picks from Lumière"
          products={chosenForYou}
          brands={brands}
          bgClass="bg-white"
          viewAllHref="/skincare"
        />

        <ProductSection
          title="Beauty Offers"
          subtitle="Soft deals and everyday essentials"
          products={beautyOffers}
          brands={brands}
          bgClass="bg-[#FAFAF7]"
          viewAllHref="/offers"
        />

        <ProductSection
          title="New Arrivals"
          subtitle="Fresh drops, just landed"
          products={newArrivals}
          brands={brands}
          bgClass="bg-white"
          viewAllHref="/new"
        />

        <BrandsSection />

        <MenGroomingSection />

        <SkinGuideSection />

        <AIAdvisorBanner />

        <DigitalShelfTeaser />

        <TrustSection />
      </main>

      <HomeFooter />
      <FloatingAIButton />
    </>
  );
}
