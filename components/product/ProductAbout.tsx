"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  description?: string | null;
  ingredients?: string | null;
  howToUse?: string | null;
  mainBenefit?: string | null;
};

export function ProductAbout({
  description,
  ingredients,
  howToUse,
  mainBenefit,
}: Props) {
  const [openIngredients, setOpenIngredients] = useState(false);
  const [openHowTo, setOpenHowTo] = useState(false);

  return (
    <div className="mx-auto mt-16 max-w-7xl px-4 md:px-6">
      <h2 className="font-serif text-xl font-normal text-[#111111]">
        About the Product
      </h2>

      <div className="mt-6 max-w-2xl">
        {/* Main benefit pill */}
        {mainBenefit && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#DDEFE3] px-4 py-1.5">
            <span className="text-[11px] font-semibold text-green-700">
              ✦ {mainBenefit}
            </span>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-[15px] leading-relaxed text-textgray">
            {description}
          </p>
        )}

        {/* Accordions */}
        <div className="mt-8 divide-y divide-[#EBEBEB] border-t border-[#EBEBEB]">
          {/* Key Ingredients */}
          {ingredients && (
            <div>
              <button
                onClick={() => setOpenIngredients(!openIngredients)}
                className="flex w-full items-center justify-between py-4 text-left"
              >
                <span className="text-sm font-semibold text-[#111111]">
                  Key Ingredients
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-textgray transition-transform duration-200 ${
                    openIngredients ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIngredients && (
                <div className="pb-5">
                  <p className="text-sm leading-relaxed text-textgray">
                    {ingredients}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* How to Use */}
          {howToUse && (
            <div>
              <button
                onClick={() => setOpenHowTo(!openHowTo)}
                className="flex w-full items-center justify-between py-4 text-left"
              >
                <span className="text-sm font-semibold text-[#111111]">
                  How to Use
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-textgray transition-transform duration-200 ${
                    openHowTo ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openHowTo && (
                <div className="pb-5">
                  <p className="text-sm leading-relaxed text-textgray">
                    {howToUse}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
