"use client";

import { useState } from "react";

const GRADIENTS = [
  "from-[#EDD0CA] to-[#B8877E]",
  "from-[#C4DAD2] to-[#7EAB9C]",
  "from-[#CEC7EE] to-[#9082C8]",
  "from-[#EAD8C5] to-[#B8906A]",
  "from-[#BDD2E8] to-[#6E9EC0]",
];

export function ProductImageGallery({
  seed,
  brandInitial,
}: {
  seed: number;
  brandInitial: string;
}) {
  const thumbGrads = Array.from(
    { length: 5 },
    (_, i) => GRADIENTS[(seed + i) % GRADIENTS.length]
  );
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-b ${thumbGrads[active]} shadow-sm`}
      >
        <span
          className="select-none font-serif text-[130px] font-light leading-none text-white/20"
          aria-hidden="true"
        >
          {brandInitial}
        </span>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2">
        {thumbGrads.map((g, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={`h-[68px] flex-1 rounded-[12px] bg-gradient-to-b ${g} border-2 transition-all ${
              active === i
                ? "border-[#111111]"
                : "border-transparent hover:border-[#DCDCDC]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
