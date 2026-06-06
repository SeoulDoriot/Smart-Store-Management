"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, Send } from "lucide-react";

export function ReportActions({ rows }: { rows: (string | number)[][] }) {
  const [note, setNote] = useState<string | null>(null);

  function exportCsv() {
    const csv = rows
      .map((r) =>
        r
          .map((cell) => {
            const v = String(cell).replace(/"/g, '""');
            return /[",\n]/.test(v) ? `"${v}"` : v;
          })
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumiere-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    flash("CSV downloaded.");
  }

  function flash(msg: string) {
    setNote(msg);
    window.setTimeout(() => setNote(null), 2600);
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 rounded-xl border border-bordergray bg-white px-3 py-2 text-xs font-medium text-textdark hover:bg-offwhite"
        >
          <FileSpreadsheet size={14} />
          Export CSV
        </button>
        <button
          onClick={() => flash("PDF export is a placeholder — not wired up yet.")}
          className="flex items-center gap-1.5 rounded-xl border border-bordergray bg-white px-3 py-2 text-xs font-medium text-textdark hover:bg-offwhite"
        >
          <FileText size={14} />
          Download PDF
        </button>
        <button
          onClick={() =>
            flash("Telegram send is a placeholder — must run server-side.")
          }
          className="flex items-center gap-1.5 rounded-xl border border-bordergray bg-white px-3 py-2 text-xs font-medium text-textdark hover:bg-offwhite"
        >
          <Send size={14} />
          Send to Telegram
        </button>
      </div>
      {note && (
        <span className="text-[11px] text-textgray">{note}</span>
      )}
    </div>
  );
}
