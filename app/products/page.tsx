import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProductsClient } from "@/components/product/ProductsClient";
import { getProducts, getBrands, getCategories } from "@/lib/products";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-textdark">All Products</h1>
          <p className="mt-1 text-sm text-textgray">
            {products.length} products available
          </p>
        </div>
        <ProductsClient
          products={products}
          categories={categories}
          brands={brands}
          initialSearch={searchParams.search}
        />
      </main>
      <SiteFooter />
    </>
  );
}
