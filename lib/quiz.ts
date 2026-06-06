import type { Product, SkinType, SkinConcern } from "@/types/product";
import { MOCK_PRODUCTS } from "./mock-data";
import { MOCK_CATEGORIES } from "./mock-data";

export type QuizAnswers = {
  skinType: SkinType | "Not sure";
  skinConcern: SkinConcern | "Not sure";
  budget: "Under $10" | "$10–$20" | "$20–$50" | "Above $50";
  productType: string;
};

function getBudgetMax(budget: string): number {
  if (budget === "Under $10") return 10;
  if (budget === "$10–$20") return 20;
  if (budget === "$20–$50") return 50;
  return Infinity;
}

function getReasonForProduct(product: Product, answers: QuizAnswers): string {
  const concerns = product.skin_concerns.slice(0, 2).join(" and ");
  const skinTypePart =
    answers.skinType !== "Not sure"
      ? ` suitable for ${answers.skinType.toLowerCase()} skin`
      : "";
  return `Helps with ${concerns}${skinTypePart}.`;
}

export function getQuizRecommendations(
  answers: QuizAnswers
): Array<{ product: Product; reason: string }> {
  let candidates = MOCK_PRODUCTS.filter(
    (p) => p.stock > 0 && p.is_ai_recommendable
  );

  if (answers.skinType !== "Not sure") {
    const byType = candidates.filter((p) =>
      p.skin_types.includes(answers.skinType as SkinType)
    );
    if (byType.length > 0) candidates = byType;
  }

  if (answers.skinConcern !== "Not sure") {
    const byConcern = candidates.filter((p) =>
      p.skin_concerns.includes(answers.skinConcern as SkinConcern)
    );
    if (byConcern.length > 0) candidates = byConcern;
  }

  const maxPrice = getBudgetMax(answers.budget);
  const byBudget = candidates.filter((p) => p.price <= maxPrice);
  if (byBudget.length > 0) candidates = byBudget;

  if (answers.productType !== "Full routine" && answers.productType !== "Not sure") {
    const categorySlugMap: Record<string, string> = {
      Cleanser: "c1",
      Toner: "c2",
      Serum: "c3",
      Moisturizer: "c4",
      Sunscreen: "c5",
    };
    const catId = categorySlugMap[answers.productType];
    if (catId) {
      const byType = candidates.filter((p) => p.category_id === catId);
      if (byType.length > 0) candidates = byType;
    }
  }

  if (candidates.length === 0) {
    candidates = MOCK_PRODUCTS.filter((p) => p.is_best_seller).slice(0, 3);
  }

  return candidates.slice(0, 4).map((p) => ({
    product: p,
    reason: getReasonForProduct(p, answers),
  }));
}
