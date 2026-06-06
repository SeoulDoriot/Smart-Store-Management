import Link from "next/link";
import type { Product } from "@/types/product";
import type { QuizAnswers } from "@/lib/quiz";
import { formatPrice } from "@/lib/utils";
import { getBrandName } from "@/lib/products";
import { RotateCcw } from "lucide-react";

export function RecommendationResult({
  results,
  answers,
  onReset,
}: {
  results: { product: Product; reason: string }[];
  answers: QuizAnswers;
  onReset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 rounded-card border border-softgreen bg-softgreen/30 px-5 py-4">
        <p className="text-sm font-medium text-green-800">
          ✓ Recommended for{" "}
          {answers.skinType !== "Not sure"
            ? `${answers.skinType.toLowerCase()} skin`
            : "your skin"}{" "}
          · Budget: {answers.budget}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="rounded-card border border-bordergray bg-white p-8 text-center">
          <p className="text-textgray">
            No exact match found. Try adjusting your answers.
          </p>
          <button
            onClick={onReset}
            className="mt-4 text-sm text-textdark underline"
          >
            Retake quiz
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map(({ product, reason }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-card border border-bordergray bg-white p-4"
            >
              <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-cream to-softpink/40" />
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-xs text-textgray">{getBrandName(product.brand_id)}</p>
                <p className="text-sm font-medium text-textdark leading-snug">
                  {product.name}
                </p>
                <p className="text-xs text-textgray">{reason}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-sm font-semibold text-textdark">
                    {formatPrice(product.price)}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="rounded-lg border border-bordergray px-3 py-1 text-xs text-textgray hover:border-textdark hover:text-textdark"
                  >
                    View Detail
                  </Link>
                  <Link
                    href={`/order?product=${product.id}`}
                    className="rounded-lg bg-textdark px-3 py-1 text-xs text-white hover:opacity-80"
                  >
                    Order
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onReset}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-bordergray bg-white py-3 text-sm text-textgray hover:bg-offwhite hover:text-textdark"
      >
        <RotateCcw size={14} />
        Retake Quiz
      </button>
    </div>
  );
}
