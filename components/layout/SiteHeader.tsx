import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";

export function SiteHeader() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />
    </>
  );
}
