"use client";

import { useState } from "react";
import type { Product, Brand, Category } from "@/types/product";
import { SearchBar } from "./SearchBar";
import { ProductFilters, type ActiveFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";
import { filterProducts, type SortOption } from "@/lib/products";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "best_seller", label: "Best Seller" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "hot_sale", label: "Hot Sale" },
];

export function ProductsClient({
  products,
  categories,
  brands,
  initialSearch = "",
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  initialSearch?: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortOption>("newest");
  const [filters, setFilters] = useState<ActiveFilters>({
    categoryId: "",
    brandId: "",
    skinType: "",
    skinConcern: "",
  });

  function handleFilterChange(key: keyof ActiveFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleClearFilters() {
    setFilters({ categoryId: "", brandId: "", skinType: "", skinConcern: "" });
    setSearch("");
    setSort("newest");
  }

  const filtered = filterProducts(products, {
    search,
    ...filters,
    sort,
  });

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 sm:max-w-sm">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-textgray">{filtered.length} products</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-xl border border-bordergray bg-white px-3 py-2 text-sm text-textdark focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[190px_1fr]">
        <ProductFilters
          categories={categories}
          brands={brands}
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
