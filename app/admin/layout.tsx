import type { ReactNode } from "react";
import { AdminStoreProvider } from "@/lib/admin-store";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminStoreProvider>{children}</AdminStoreProvider>;
}
