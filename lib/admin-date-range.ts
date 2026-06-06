export type AdminDateRangeKey =
  | "today"
  | "yesterday"
  | "last7"
  | "month"
  | "custom"
  | "all";

export const ADMIN_DATE_RANGE_OPTIONS: {
  key: AdminDateRangeKey;
  label: string;
}[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last7", label: "Last 7 Days" },
  { key: "month", label: "This Month" },
  { key: "custom", label: "Custom Date" },
  { key: "all", label: "All" },
];

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getAdminDateRange(
  key: AdminDateRangeKey,
  customDate = "",
  now = new Date()
) {
  const today = startOfDay(now);
  const tomorrow = addDays(today, 1);

  if (key === "today") {
    return { start: today, end: tomorrow, label: "Today" };
  }

  if (key === "yesterday") {
    const yesterday = addDays(today, -1);
    return { start: yesterday, end: today, label: "Yesterday" };
  }

  if (key === "last7") {
    return { start: addDays(today, -6), end: tomorrow, label: "Last 7 Days" };
  }

  if (key === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { start, end: tomorrow, label: "This Month" };
  }

  if (key === "custom" && customDate) {
    const start = startOfDay(new Date(`${customDate}T00:00:00`));
    return {
      start,
      end: addDays(start, 1),
      label: `Custom Date: ${customDate}`,
    };
  }

  return { start: null, end: null, label: "All" };
}

export function isInAdminDateRange(
  value: string | undefined | null,
  key: AdminDateRangeKey,
  customDate = "",
  now = new Date()
) {
  const { start, end } = getAdminDateRange(key, customDate, now);
  if (!start || !end) return true;
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date >= start && date < end;
}

export function defaultAdminCustomDate(now = new Date()) {
  return formatDate(now);
}
