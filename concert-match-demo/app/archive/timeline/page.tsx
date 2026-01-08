"use client";

import { useMemo, useState } from "react";
import { DotGothic16, Space_Mono } from "next/font/google";
import BottomNav from "../../components/BottomNav";

const dotGothic = DotGothic16({ subsets: ["latin"], weight: "400", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

type TimeFilter = "all" | "yearly" | "monthly" | "daily";

type TimelineMedia = {
  id: string;
  dateISO: string; // YYYY-MM-DD
};

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        spaceMono.className,
        "h-8 px-3 rounded-lg text-[12px]",
        active ? "bg-white/15 text-white" : "text-white/70 hover:text-white/90",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function MediaCard({ dateISO, tall }: { dateISO: string; tall?: boolean }) {
  return (
    <div className="snap-center shrink-0 w-[250px]">
      <div className={["rounded-2xl overflow-hidden", tall ? "h-[360px]" : "h-[320px]", "bg-zinc-200/90 shadow-sm"].join(" ")}>
        <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.35),rgba(0,0,0,0.1))]" />
      </div>

      <div className={[dotGothic.className, "mt-3 text-white text-[22px]"].join(" ")}>
        {dateISO.split("-").reverse().join("/")}
      </div>
    </div>
  );
}

export default function ArchivesTimelinePage() {
  const [filter, setFilter] = useState<TimeFilter>("all");

  const items = useMemo<TimelineMedia[]>(
    () => [
      { id: "1", dateISO: "2023-05-24" },
      { id: "2", dateISO: "2023-06-13" },
      { id: "3", dateISO: "2023-10-02" },
      { id: "4", dateISO: "2024-01-16" },
      { id: "5", dateISO: "2024-03-08" },
      { id: "6", dateISO: "2024-08-22" },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (filter === "yearly") return items.slice(0, 4);
    if (filter === "monthly") return items.slice(1, 5);
    if (filter === "daily") return items.slice(2, 6);
    return items;
  }, [items, filter]);

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
            <img
            src="/bg/archive.png"
            alt=""
            className="h-full w-full object-cover object-top"
            draggable={false}
            />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 px-6 pt-10 pb-[92px] flex flex-col items-center">
          {/* header */}
          <div className={[dotGothic.className, "text-white text-[44px] leading-[0.95] text-center"].join(" ")}>
            <div>scroll to</div>
            <div className="text-purple-200">discover</div>
          </div>

          <div className={[spaceMono.className, "mt-3 text-white/70 text-[12px] text-center"].join(" ")}>
            Use the Archive Timeline
            <br />
            to find events
          </div>

          {/* scroller (centered vertically) */}
          <div className="flex-1 flex items-center w-full mt-6">
            <div
              className={[
                "flex gap-6",
                "overflow-x-auto pb-4",
                "snap-x snap-mandatory",
                "scrollbar-none",
                "w-full",
              ].join(" ")}
            >
              {filtered.map((it, idx) => (
                <MediaCard key={it.id} dateISO={it.dateISO} tall={idx % 3 === 1} />
              ))}
              <div className="shrink-0 w-4" />
            </div>
          </div>

          {/* bottom filter bar */}
          <div className="fixed left-0 right-0 bottom-[72px] px-4">
            <div className="max-w-[520px] mx-auto">
              <div className="rounded-2xl border border-white/15 bg-black/70 backdrop-blur-md p-2">
                <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                  <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
                  <FilterChip label="Yearly" active={filter === "yearly"} onClick={() => setFilter("yearly")} />
                  <FilterChip label="Monthly" active={filter === "monthly"} onClick={() => setFilter("monthly")} />
                  <FilterChip label="Daily" active={filter === "daily"} onClick={() => setFilter("daily")} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
