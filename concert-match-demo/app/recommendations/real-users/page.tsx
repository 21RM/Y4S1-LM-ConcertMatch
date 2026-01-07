"use client";

import { useMemo, useRef, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { DotGothic16, Space_Mono } from "next/font/google";
import { useRouter } from "next/navigation";


const dotGothic = DotGothic16({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

type Card = {
  id: string;
  handle: string;
  accent: string;
  gradient: string;
  text: string;
};

export default function RealUsersPage() {
  const router = useRouter();
  
  const cards: Card[] = useMemo(
    () => [
      {
        id: "1",
        handle: "@batata",
        accent: "rgba(245, 231, 110, 0.95)",
        gradient:
          "linear-gradient(135deg, rgba(255,210,120,0.92) 0%, rgba(255,120,160,0.86) 45%, rgba(110,90,255,0.82) 100%)",
        text:
          "The history of music in Portugal would not be the same without the Paredes de Coura Festival.\n\nThroughout its 30 years of existence, the oldest and most charismatic Portuguese festival has made history in discovering new musical promises and presenting the most renowned names in music worldwide.",
      },
      {
        id: "2",
        handle: "@maria",
        accent: "rgba(235, 160, 255, 0.95)",
        gradient:
          "linear-gradient(135deg, rgba(235,120,255,0.92) 0%, rgba(170,120,255,0.86) 50%, rgba(90,170,255,0.80) 100%)",
        text: "My pick: a night drive playlist + a festival warmup. Try it on shuffle.",
      },
      {
        id: "3",
        handle: "@joao",
        accent: "rgba(140, 220, 255, 0.95)",
        gradient:
          "linear-gradient(135deg, rgba(120,230,255,0.92) 0%, rgba(120,255,210,0.86) 55%, rgba(120,200,255,0.82) 100%)",
        text: "If you like indie, start with the headliner… then go early for the small stages.",
      },
      {
        id: "4",
        handle: "@ines",
        accent: "rgba(170, 255, 140, 0.95)",
        gradient:
          "linear-gradient(135deg, rgba(170,255,140,0.92) 0%, rgba(255,240,140,0.86) 55%, rgba(140,255,220,0.80) 100%)",
        text: "Bring comfy shoes. The best sets are the ones you discover by accident.",
      },
      {
        id: "5",
        handle: "@tiago",
        accent: "rgba(120, 255, 220, 0.95)",
        gradient:
          "linear-gradient(135deg, rgba(120,255,220,0.92) 0%, rgba(120,210,255,0.84) 55%, rgba(120,170,255,0.80) 100%)",
        text: "Recommendation: listen to the lineup the week before—your live experience doubles.",
      },
    ],
    []
  );

  const [open, setOpen] = useState<Card | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // refs to each card, so arrows can scroll to them
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function goTo(nextIndex: number) {
    const n = cards.length;
    if (!n) return;

    // wrap around
    const idx = ((nextIndex % n) + n) % n;
    setActiveIndex(idx);

    const el = cardRefs.current[idx];
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  return (
    <main className="min-h-dvh text-white bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(700px_circle_at_50%_-10%,rgba(255,255,255,0.10),transparent_60%)]" />

      <div className="relative mx-auto min-h-dvh max-w-[420px]">
        <div className="min-h-dvh px-6 pt-8 pb-28 flex flex-col">
          {/* Header */}
          <div className={`${dotGothic.className} text-[36px] leading-[1.05]`}>
            <div>real</div>
            <div className="whitespace-nowrap">recommendations</div>
            <div className="whitespace-nowrap">
              <span className="text-lime-300">by real people.</span>
            </div>
            <div className="mt-3 text-[14px] text-white/70">tap to reveal</div>
          </div>

          {/* Cards (centered) */}
          <div className="flex-1 flex items-center">
            <div className="w-full -mx-6 px-6">
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
                {cards.map((c, idx) => (
                  <button
                    key={c.id}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => {
                      setActiveIndex(idx);
                      setOpen(c);
                    }}
                    className={[
                      "snap-center shrink-0",
                      "h-[320px] w-[205px] rounded-2xl",
                      "relative overflow-hidden",
                      "transition-transform active:scale-[0.98]",
                      idx % 2 === 0 ? "-rotate-2" : "rotate-2",
                      // tiny active feedback (optional but helps)
                      activeIndex === idx ? "outline outline-2 outline-white/30" : "",
                    ].join(" ")}
                    style={{
                      boxShadow: `
                        0 16px 40px rgba(0,0,0,0.55),
                        0 0 0 5px ${c.accent} inset
                      `,
                    }}
                    aria-label={`Open ${c.handle} recommendation`}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: c.gradient }}
                    />
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(600px_circle_at_30%_20%,rgba(255,255,255,0.28),transparent_55%)]" />
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_45%,rgba(0,0,0,0.18))]" />

                    <div
                      className={`${dotGothic.className} absolute left-4 bottom-4 text-[22px] leading-none text-white drop-shadow`}
                    >
                      {c.handle}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom action + arrows (now functional) */}
          <div
            className={`${dotGothic.className} mt-2 flex items-center justify-center gap-7 text-white/85`}
          >
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="text-[34px] leading-none select-none hover:opacity-100 opacity-80 transition"
              aria-label="Previous recommendation"
            >
              ‹
            </button>
            
            <button
            type="button"
            onClick={() => router.push("/recommendations/create")}
            className="text-[26px] text-center leading-6"
            aria-label="Create a recommendation"
            >
            create a
            <br />
            <span className="underline underline-offset-4">recommendation</span>
            </button>

            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="text-[34px] leading-none select-none hover:opacity-100 opacity-80 transition"
              aria-label="Next recommendation"
            >
              ›
            </button>
          </div>
        </div>

        <BottomNav />
      </div>

      {/* Modal */}
        {open && (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            role="dialog"
            aria-modal="true"
            onPointerDown={() => setOpen(null)}
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

            {/* modal card (fixed size) */}
            <div
            className={`${dotGothic.className} relative w-[340px] max-w-[92vw] h-[420px] rounded-2xl bg-zinc-200 text-zinc-900 shadow-2xl overflow-hidden`}
            onPointerDown={(e) => e.stopPropagation()}
            >
            {/* close (outlined like reference) */}
            <button
                type="button"
                onClick={() => setOpen(null)}
                className={`${dotGothic.className} absolute right-4 top-4 h-10 w-10 grid place-items-center rounded-lg border-2 border-zinc-800/80 text-zinc-900 hover:bg-black/5 transition`}
                aria-label="Close"
            >
                X
            </button>

            {/* header */}
            <div className="px-5 pt-5 pb-3 pr-14">
                <div className="text-[18px]">{open.handle}</div>
            </div>

            {/* scrollable text area (bigger text) */}
            <div className="px-5">
                <div
                    className={`${spaceMono.className} h-[250px] overflow-y-auto pr-2 text-[14px] leading-6 text-zinc-800`}
                >
                    <p className="whitespace-pre-line">{open.text}</p>
                </div>
                </div>

            {/* footer square */}
            <div className="absolute left-5 bottom-5">
                <div className="h-16 w-16 rounded-xl bg-[#e6c7ff]" />
            </div>
            </div>
        </div>
        )}
    </main>
  );
}
