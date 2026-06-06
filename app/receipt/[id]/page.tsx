import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { FloatingAIButton } from "@/components/home/FloatingAIButton";
import { ReceiptPageClient } from "@/components/order/ReceiptPageClient";
import { getOrderByCode } from "@/lib/orders";

export default async function ReceiptPage({
  params,
}: {
  params: { id: string };
}) {
  // Resolve from MOCK_ORDERS on the server; session orders are resolved
  // client-side inside ReceiptPageClient.
  const serverOrder = getOrderByCode(params.id);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />
      <ReceiptPageClient orderCode={params.id} serverOrder={serverOrder} />
      <HomeFooter />
      <FloatingAIButton />
    </>
  );
}
