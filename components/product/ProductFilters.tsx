import type { Brand, Category } from "@/types/product";
import { SKIN_TYPES, SKIN_CONCERNS } from "@/lib/mock-data";

export type ActiveFilters = {
  categoryId: string;
  brandId: string;
  skinType: string;
  skinConcern: string;
};

export function ProductFilters({
  categories,
  brands,
  filters,
  onChange,
  onClear,
}: {
  categories: Category[];
  brands: Brand[];
  filters: ActiveFilters;
  onChange: (key: keyof ActiveFilters, value: string) => void;
  onClear: () => void;
}) {
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <aside className="space-y-8 bg-white lg:sticky lg:top-36 lg:self-start">
      {hasFilters && (
        <button
          onClick={onClear}
          className="text-xs font-medium text-textgray underline underline-offset-4 hover:text-textdark"
        >
          Clear all filters
        </button>
      )}

      <FilterSection label="Category">
        <FilterButton
          label="All Products"
          active={!filters.categoryId}
          onClick={() => onChange("categoryId", "")}
        />
        {categories.map((c) => (
          <FilterButton
            key={c.id}
            label={c.name}
            active={filters.categoryId === c.id}
            onClick={() =>
              onChange("categoryId", filters.categoryId === c.id ? "" : c.id)
            }
          />
        ))}
      </FilterSection>

      <FilterSection label="Brand">
        <FilterButton
          label="All Brands"
          active={!filters.brandId}
          onClick={() => onChange("brandId", "")}
        />
        {brands.map((b) => (
          <FilterButton
            key={b.id}
            label={b.name}
            active={filters.brandId === b.id}
            onClick={() =>
              onChange("brandId", filters.brandId === b.id ? "" : b.id)
            }
          />
        ))}
      </FilterSection>

      <FilterSection label="Skin Type">
        {SKIN_TYPES.map((t) => (
          <FilterButton
            key={t}
            label={t}
            active={filters.skinType === t}
            onClick={() =>
              onChange("skinType", filters.skinType === t ? "" : t)
            }
          />
        ))}
      </FilterSection>

      <FilterSection label="Skin Concern">
        {SKIN_CONCERNS.map((c) => (
          <FilterButton
            key={c}
            label={c}
            active={filters.skinConcern === c}
            onClick={() =>
              onChange("skinConcern", filters.skinConcern === c ? "" : c)
            }
          />
        ))}
      </FilterSection>
    </aside>
  );
}

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-textgray">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
        active
          ? "bg-[#111111] font-medium text-white"
          : "text-textgray hover:bg-offwhite hover:text-textdark"
      }`}
    >
      {label}
    </button>
  );
}
