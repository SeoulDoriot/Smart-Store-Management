import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { FloatingAIButton } from "@/components/home/FloatingAIButton";
import { MenGroomingClient } from "@/components/men/MenGroomingClient";

export const metadata = {
  title: "Men's Grooming — Lumière",
  description:
    "Clean face, fresh hair, daily sunscreen, and fragrance — men's grooming curated for simple routines.",
};

export default function MenPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />
      <MenGroomingClient />
      <HomeFooter />
      <FloatingAIButton />
    </>
  );
}
