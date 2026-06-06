import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MEN_SETS } from "@/lib/men-products";
import { formatPrice } from "@/lib/utils";

export function MenGroomingSection() {
  const sets = MEN_SETS.slice(0, 3);

  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="overflow-hidden rounded-[28px] bg-[#1A1A1A]">
          <div className="grid gap-8 p-7 md:grid-cols-[1fr_1.6fr] md:p-10 lg:gap-12">
            {/* ── Intro ── */}
            <div className="flex flex-col justify-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
                For Him
              </p>
              <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-white md:text-4xl">
                Men&apos;s Grooming, simplified.
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                Clean face, fresh hair, daily sunscreen, and fragrance — easy sets
                built around a simple routine.
              </p>
              <Link
                href="/men"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1A1A1A] transition-all hover:gap-3 hover:bg-white/90"
              >
                Shop Men&apos;s
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* ── Easy sets ── */}
            <div className="grid gap-4 sm:grid-cols-3">
              {sets.map((set) => (
                <Link
                  key={set.id}
                  href="/men"
                  className="group flex flex-col rounded-2xl border border-white/12 bg-white/[0.04] p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
                >
                  <div className="flex h-20 items-center justify-center rounded-xl bg-gradient-to-b from-white/12 to-white/[0.03]">
                    <span className="font-serif text-base font-light text-white/35">
                      {set.name.replace(" Set", "")}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-base font-normal text-white">
                    {set.name}
                  </h3>
                  <ul className="mt-2 flex-1 space-y-1">
                    {set.includes.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-[11px] text-white/55">
                        <Check size={11} className="shrink-0 text-white/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm font-bold text-white">{formatPrice(set.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
