import { AdminPaymentsClient } from "@/components/admin/AdminPaymentsClient";
import { AdminShell } from "@/components/layout/AdminShell";

export default function AdminPaymentsPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-textdark">Payments</h1>
        <p className="mt-1 text-sm text-textgray">
          Review submitted mock payments and approve or reject them.
        </p>
      </div>

      <AdminPaymentsClient />
    </AdminShell>
  );
}
