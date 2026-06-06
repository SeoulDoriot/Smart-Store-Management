import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="reveal-soft flex flex-col items-center justify-center rounded-card border border-bordergray bg-white py-16 text-center">
        <p className="text-textdark font-medium">No products found</p>
        <p className="mt-1 text-sm text-textgray">
          No matching products found. Try another keyword or filter.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
