import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "green" | "yellow" | "red";

const variantStyles: Record<Variant, string> = {
  default: "bg-white",
  green:   "bg-green-50  border-green-200",
  yellow:  "bg-yellow-50 border-yellow-200",
  red:     "bg-red-50    border-red-200",
};

const iconVariantStyles: Record<Variant, string> = {
  default: "bg-offwhite text-textgray",
  green:   "bg-green-100  text-green-600",
  yellow:  "bg-yellow-100 text-yellow-600",
  red:     "bg-red-100    text-red-600",
};

export function AdminStatCard({
  label,
  value,
  sub,
  icon,
  variant = "default",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  variant?: Variant;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-bordergray p-5",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-textgray">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-textdark">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-textgray">{sub}</p>}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
              iconVariantStyles[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
