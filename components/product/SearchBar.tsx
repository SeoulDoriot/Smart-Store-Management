"use client";

import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search products, brands, concerns…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textgray"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-bordergray bg-white pl-10 pr-10 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-textgray hover:text-textdark"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
