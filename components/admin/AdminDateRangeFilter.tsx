"use client";

import {
  ADMIN_DATE_RANGE_OPTIONS,
  defaultAdminCustomDate,
  type AdminDateRangeKey,
} from "@/lib/admin-date-range";

export function AdminDateRangeFilter({
  value,
  customDate,
  label,
  onChange,
  onCustomDateChange,
}: {
  value: AdminDateRangeKey;
  customDate: string;
  label: string;
  onChange: (value: AdminDateRangeKey) => void;
  onCustomDateChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={value}
        onChange={(event) => {
          const next = event.target.value as AdminDateRangeKey;
          onChange(next);
          if (next === "custom" && !customDate) {
            onCustomDateChange(defaultAdminCustomDate());
          }
        }}
        className="h-10 rounded-xl border border-bordergray bg-white px-3 text-sm text-textdark focus:border-textdark focus:outline-none"
      >
        {ADMIN_DATE_RANGE_OPTIONS.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>

      {value === "custom" && (
        <input
          type="date"
          value={customDate}
          onChange={(event) => onCustomDateChange(event.target.value)}
          className="h-10 rounded-xl border border-bordergray bg-white px-3 text-sm text-textdark focus:border-textdark focus:outline-none"
        />
      )}

      <span className="rounded-full border border-bordergray bg-white px-3 py-1.5 text-xs font-medium text-textgray">
        {label}
      </span>
    </div>
  );
}
