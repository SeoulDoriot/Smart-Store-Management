"use client";

import { useState } from "react";
import { getQuizRecommendations, type QuizAnswers } from "@/lib/quiz";
import type { Product } from "@/types/product";
import { RecommendationResult } from "./RecommendationResult";

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  {
    id: 1 as Step,
    question: "What is your skin type?",
    key: "skinType" as keyof QuizAnswers,
    options: ["Oily", "Dry", "Sensitive", "Combination", "Normal", "Not sure"],
  },
  {
    id: 2 as Step,
    question: "What is your main skin concern?",
    key: "skinConcern" as keyof QuizAnswers,
    options: [
      "Acne",
      "Dark Spots",
      "Redness",
      "Dull Skin",
      "Large Pores",
      "Dryness",
      "Oil Control",
      "Sun Protection",
    ],
  },
  {
    id: 3 as Step,
    question: "What is your budget?",
    key: "budget" as keyof QuizAnswers,
    options: ["Under $10", "$10–$20", "$20–$50", "Above $50"],
  },
  {
    id: 4 as Step,
    question: "What product do you need?",
    key: "productType" as keyof QuizAnswers,
    options: [
      "Cleanser",
      "Toner",
      "Serum",
      "Moisturizer",
      "Sunscreen",
      "Full routine",
      "Not sure",
    ],
  },
];

const EMPTY: QuizAnswers = {
  skinType: "Not sure",
  skinConcern: "Not sure",
  budget: "$10–$20",
  productType: "Not sure",
};

export function SkinQuiz() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({ ...EMPTY });
  const [results, setResults] = useState<{ product: Product; reason: string }[]>([]);
  const [done, setDone] = useState(false);

  function selectOption(key: keyof QuizAnswers, value: string) {
    const newAnswers = { ...answers, [key]: value } as QuizAnswers;
    setAnswers(newAnswers);

    if (step < 4) {
      setStep(((step + 1) as Step));
    } else {
      setResults(getQuizRecommendations(newAnswers));
      setDone(true);
    }
  }

  function reset() {
    setStep(1);
    setAnswers({ ...EMPTY });
    setResults([]);
    setDone(false);
  }

  function goBack() {
    if (step > 1) setStep(((step - 1) as Step));
  }

  if (done) {
    return (
      <RecommendationResult
        results={results}
        answers={answers}
        onReset={reset}
      />
    );
  }

  const current = STEPS[step - 1];
  const progress = ((step - 1) / 4) * 100;

  return (
    <div className="mx-auto max-w-xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-textgray mb-2">
          <span>Step {step} of 4</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bordergray">
          <div
            className="h-full rounded-full bg-textdark transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="rounded-card border border-bordergray bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-textdark">{current.question}</h2>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => selectOption(current.key, opt)}
              className="rounded-xl border border-bordergray bg-white px-4 py-3 text-sm text-textdark transition-all hover:border-textdark hover:bg-offwhite active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>

        {step > 1 && (
          <button
            onClick={goBack}
            className="mt-5 text-sm text-textgray hover:text-textdark"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
