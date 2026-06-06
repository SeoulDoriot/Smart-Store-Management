import { cn } from "@/lib/utils";

type BadgeColor = "green" | "blue" | "yellow" | "orange" | "red" | "purple" | "gray";

function getStatusColor(status: string): BadgeColor {
  switch (status) {
    case "New Order": return "blue";
    case "Waiting Payment": return "yellow";
    case "Paid": return "green";
    case "Preparing": return "orange";
    case "Packing": return "orange";
    case "Delivering": return "purple";
    case "Completed": return "green";
    case "Cancelled": return "red";
    case "Payment Pending": return "yellow";
    case "Payment Submitted": return "blue";
    case "Payment Successful": return "green";
    case "Payment Rejected": return "red";
    case "Payment Failed": return "red";
    case "Payment Expired": return "red";
    case "Refunded": return "gray";
    case "Order Created": return "gray";
    case "Ready for Delivery": return "blue";
    default: return "gray";
  }
}

const colorClasses: Record<BadgeColor, string> = {
  green:  "bg-green-50  text-green-700  border-green-200",
  blue:   "bg-blue-50   text-blue-700   border-blue-200",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  red:    "bg-red-50    text-red-700    border-red-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  gray:   "bg-gray-50   text-gray-600   border-gray-200",
};

export function StatusBadge({ status }: { status: string }) {
  const color = getStatusColor(status);
  return (
    <span
      className={cn(
        "inline-flex min-w-max items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        colorClasses[color]
      )}
    >
      {status}
    </span>
  );
}
