import { notFound } from "next/navigation";
import { CATEGORY_CONFIGS, getDisplayConfig } from "@/lib/category-config";
import { getProducts, getBrands } from "@/lib/products";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Header } from "@/components/home/Header";
import { NavigationBar } from "@/components/home/NavigationBar";
import { HomeFooter } from "@/components/home/HomeFooter";
import { FloatingAIButton } from "@/components/home/FloatingAIButton";
import { CategoryShell } from "@/components/catalog/CategoryShell";

// Tell Next.js which slugs exist (for static generation)
export function generateStaticParams() {
  return Object.keys(CATEGORY_CONFIGS).map((slug) => ({ category: slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const config = getDisplayConfig(params.category);
  if (!config) return {};
  return {
    title: `${config.title} — Lumière`,
    description: config.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { sub?: string };
}) {
  const full = CATEGORY_CONFIGS[params.category];
  if (!full) notFound();

  // Apply the category filter server-side; pass pre-filtered products to client
  const [allProducts, brands] = await Promise.all([getProducts(), getBrands()]);
  const products = allProducts.filter(full.filterFn);

  // Build serializable display config (strips filterFn)
  const displayConfig = getDisplayConfig(params.category)!;

  return (
    <>
      <AnnouncementBar />
      <Header />
      <NavigationBar />

      <main>
        {/* Breadcrumb + page title */}
        <div className="border-b border-bordergray bg-white px-4 py-5 md:px-6">
          <div className="mx-auto max-w-7xl">
            <nav className="mb-1.5 flex items-center gap-1.5 text-xs text-textgray">
              <span>Home</span>
              <span>/</span>
              <span className="font-medium text-textdark">{displayConfig.title}</span>
            </nav>
            <h1 className="font-serif text-3xl font-normal text-textdark">
              {displayConfig.title}
            </h1>
            {displayConfig.description && (
              <p className="mt-0.5 text-sm text-textgray">
                {displayConfig.description}
              </p>
            )}
          </div>
        </div>

        <CategoryShell
          config={displayConfig}
          products={products}
          brands={brands}
          initialSub={searchParams.sub}
        />
      </main>

      <HomeFooter />
      <FloatingAIButton />
    </>
  );
}
