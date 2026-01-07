"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import BottomNav from "../../../components/BottomNav";
import { DotGothic16 } from "next/font/google";

const dotGothic = DotGothic16({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

type Item = {
  id: string;
  kind: "event" | "media";
  title: string;
};

function Card({
  item,
  onClick,
  cardRef,
  focused,
}: {
  item: Item;
  onClick: (item: Item) => void;
  cardRef?: (el: HTMLButtonElement | null) => void;
  focused: boolean;
}) {
  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onClick(item)}
      className={[
        "snap-center snap-always shrink-0",
        "h-[170px] w-[150px]",
        "rounded-2xl bg-zinc-200/90",
        "active:scale-[0.98] transition",
        focused ? "outline outline-2 outline-white/35" : "",
      ].join(" ")}
      aria-label={`Open ${item.kind}`}
    />
  );
}

function Row({
  label,
  items,
  onOpen,
  refs,
  activeIndex,
  setActiveIndex,
}: {
  label: string;
  items: Item[];
  onOpen: (it: Item) => void;
  refs: React.MutableRefObject<Array<HTMLButtonElement | null>>;
  activeIndex: number;
  setActiveIndex: (n: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // IMPORTANT: arrows always read from this ref (keeps perfect sync)
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const syncIndexToScroll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const scRect = scroller.getBoundingClientRect();
      const centerX = scRect.left + scRect.width / 2;

      let bestIdx = activeIndexRef.current;
      let bestDist = Number.POSITIVE_INFINITY;

      for (let i = 0; i < items.length; i++) {
        const el = refs.current[i];
        if (!el) continue;

        const r = el.getBoundingClientRect();
        const elCenter = r.left + r.width / 2;
        const dist = Math.abs(elCenter - centerX);

        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }

      if (bestIdx !== activeIndexRef.current) {
        activeIndexRef.current = bestIdx;
        setActiveIndex(bestIdx);
      }
    });
  };

  const goTo = (delta: number) => {
    const n = items.length;
    if (!n) return;

    const current = activeIndexRef.current;
    const next = ((current + delta) % n + n) % n;

    activeIndexRef.current = next;
    setActiveIndex(next);

    refs.current[next]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section className="flex-1 flex flex-col">
      {/* Row title aligned to start (left): < events > */}
      <div className={`${dotGothic.className} flex items-center gap-2 text-[20px] text-white/90`}>
        <button
          type="button"
          onClick={() => goTo(-1)}
          className="text-[26px] leading-none opacity-80 hover:opacity-100 transition select-none"
          aria-label={`Previous ${label}`}
        >
          &lt;
        </button>

        <div className="leading-none">{label}</div>

        <button
          type="button"
          onClick={() => goTo(1)}
          className="text-[26px] leading-none opacity-80 hover:opacity-100 transition select-none"
          aria-label={`Next ${label}`}
        >
          &gt;
        </button>
      </div>

      {/* Scroller fills remaining row height and centers vertically */}
      <div className="mt-3 flex-1 flex items-center -mx-6 px-6">
        <div
          ref={scrollerRef}
          onScroll={syncIndexToScroll}
          onMouseUp={syncIndexToScroll}
          onTouchEnd={syncIndexToScroll}
          className="
            no-scrollbar
            flex gap-4 overflow-x-auto
            snap-x snap-mandatory scroll-smooth
            pb-2
          "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* hide scrollbar (scoped) */}
          <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          {items.map((it, idx) => (
            <Card
              key={it.id}
              item={it}
              focused={idx === activeIndex}
              onClick={(x) => {
                activeIndexRef.current = idx;
                setActiveIndex(idx);
                refs.current[idx]?.scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                  block: "nearest",
                });
                onOpen(x);
              }}
              cardRef={(el) => {
                refs.current[idx] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function GenreResultsPage() {
  const sp = useSearchParams();
  const g = sp.get("g") ?? "rock,pop,alternative";

  const genres = useMemo(
    () =>
      g
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [g]
  );

  const genreLine = genres.map((x) => `${x};`).join(" ");
  const [open, setOpen] = useState<Item | null>(null);

  const events: Item[] = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: `e${i}`,
        kind: "event",
        title: `Event ${i + 1}`,
      })),
    []
  );

  const media: Item[] = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: `m${i}`,
        kind: "media",
        title: `Media ${i + 1}`,
      })),
    []
  );

  const eventRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mediaRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [eventIndex, setEventIndex] = useState(0);
  const [mediaIndex, setMediaIndex] = useState(0);

  return (
    <main className="min-h-dvh text-white bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(700px_circle_at_60%_-10%,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="relative mx-auto min-h-dvh max-w-[420px]">
        <div className="min-h-dvh px-6 pt-10 pb-28 flex flex-col">
          {/* Header */}
          <div className={`${dotGothic.className} text-[34px] leading-[1.02]`}>
            <div>recommendations</div>
            <div>for:</div>
            <div className="text-[#d7b7ff]">{genreLine || "—"}</div>
          </div>

          {/* Two rows evenly split remaining height */}
          <div className="mt-6 flex-1 flex flex-col gap-6">
            <Row
              label="events"
              items={events}
              onOpen={setOpen}
              refs={eventRefs}
              activeIndex={eventIndex}
              setActiveIndex={setEventIndex}
            />

            <Row
              label="media"
              items={media}
              onOpen={setOpen}
              refs={mediaRefs}
              activeIndex={mediaIndex}
              setActiveIndex={setMediaIndex}
            />
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
          <div className="absolute inset-0 bg-black/55" />

          <div
            className="relative w-[330px] max-w-[92vw] h-[360px] rounded-2xl bg-zinc-200 shadow-2xl overflow-hidden"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              className={`${dotGothic.className} absolute right-3 top-3 h-8 w-8 grid place-items-center rounded-md border-2 border-zinc-800/80 text-zinc-900`}
              aria-label="Close"
            >
              X
            </button>

            <div className="h-full w-full" />
          </div>
        </div>
      )}
    </main>
  );
}
