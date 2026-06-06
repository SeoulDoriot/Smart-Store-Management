import { MOCK_PRODUCTS, MOCK_BRANDS } from "@/lib/mock-data";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { AIAdvisorClient } from "@/components/ai-advisor/AIAdvisorClient";

export const metadata = {
  title: "AI Beauty Advisor — Lumière",
  description:
    "Get instant, personalised skincare recommendations from our AI Beauty Advisor.",
};

export default function AIAdvisorPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />
      <AIAdvisorClient products={MOCK_PRODUCTS} brands={MOCK_BRANDS} />
      <HomeFooter />
    </>
  );
}
