"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  defaultAdminCustomDate,
  type AdminDateRangeKey,
} from "@/lib/admin-date-range";
import { AdminDateRangeFilter } from "./AdminDateRangeFilter";

export function AdminDateRangeUrlFilter({
  value,
  customDate,
  label,
}: {
  value: AdminDateRangeKey;
  customDate: string;
  label: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(nextRange: AdminDateRangeKey, nextDate = customDate) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", nextRange);

    if (nextRange === "custom") {
      params.set("date", nextDate || defaultAdminCustomDate());
    } else {
      params.delete("date");
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <AdminDateRangeFilter
      value={value}
      customDate={customDate}
      label={label}
      onChange={(nextRange) => update(nextRange)}
      onCustomDateChange={(nextDate) => update("custom", nextDate)}
    />
  );
}
