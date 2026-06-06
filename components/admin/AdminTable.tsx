import type { ReactNode } from "react";

export type TableColumn = {
  key: string;
  label: string;
  className?: string;
};

type Row = Record<string, ReactNode>;

export function AdminTable({
  columns,
  rows = [],
  emptyMessage = "No data yet.",
}: {
  columns: TableColumn[];
  rows?: Row[];
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-card border border-bordergray bg-white">
      <table className="w-full min-w-[600px] text-sm">
        <thead className="border-b border-bordergray bg-offwhite text-left text-xs uppercase tracking-wide text-textgray">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-bordergray">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-textgray"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="hover:bg-offwhite/50">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>
                    {row[c.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
