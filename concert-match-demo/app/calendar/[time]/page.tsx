"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { DotGothic16, Space_Mono } from "next/font/google";
import { useParams, useRouter } from "next/navigation";


const dotGothic = DotGothic16({ subsets: ["latin"], weight: "400", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

type CalEvent = {
  id: string;
  title: string;
  venue: string;
  datetimeISO: string; // local time string "YYYY-MM-DDTHH:mm:00"
};

function ordinal(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n}st`;
  if (mod10 === 2 && mod100 !== 12) return `${n}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${n}rd`;
  return `${n}th`;
}

function formatDateLineLocal(d: Date) {
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
  const month = d.toLocaleDateString("en-GB", { month: "long" });
  const year = d.getFullYear();
  return `${ordinal(d.getDate())} of ${month} ${year}, ${weekday}`;
}

function formatTimeLocal(d: Date) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function startOfDayLocal(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function addDaysLocal(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function startOfWeekMonday(d: Date) {
  const sd = startOfDayLocal(d);
  const day = sd.getDay(); // Sun=0 ... Sat=6
  const diff = (day + 6) % 7; // Mon=0 ... Sun=6
  return addDaysLocal(sd, -diff);
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function startOfNextMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, 0, 0);
}
function startOfYear(d: Date) {
  return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
}
function startOfNextYear(d: Date) {
  return new Date(d.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
}

const COPY: Record<string, { top: string; accent: string; subtitle: string }> = {
  today: { top: "today", accent: "", subtitle: "Find out what events await\nyou today" },
  day: { top: "today", accent: "", subtitle: "Find out what events await\nyou today" },
  week: { top: "this", accent: "week", subtitle: "Find out what events await\nyou this week" },
  month: { top: "this", accent: "month", subtitle: "Find out what events await\nyou this month" },
  year: { top: "this", accent: "year", subtitle: "Find out what events await\nyou this year" },
  all: { top: "all", accent: "events", subtitle: "Browse everything that’s\ncoming up soon" },
};

export default function CalendarRangePage() {
  const router = useRouter();

  const params = useParams<{ time: string }>();
  const timeRaw = (params?.time ?? "month").toLowerCase();
  const time = COPY[timeRaw] ? timeRaw : "month";
  const copy = COPY[time];

  const [now] = useState(() => new Date());

  const [events, setEvents] = useState<CalEvent[]>(() => {
    const base = startOfDayLocal(new Date());
    const mk = (id: string, title: string, venue: string, daysFromNow: number, hh: number, mm: number) => {
      const d = addDaysLocal(base, daysFromNow);
      const local = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh, mm, 0, 0);
      const isoLocal =
        `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}` +
        `T${String(local.getHours()).padStart(2, "0")}:${String(local.getMinutes()).padStart(2, "0")}:00`;
      return { id, title, venue, datetimeISO: isoLocal };
    };

    return [
      mk("e1", "Slow J", "Super Bock Arena", 0, 20, 30),
      mk("e2", "NAPA", "Coliseu Ageas Porto", 2, 21, 0),
      mk("e3", "Capicua", "Casa da Música", 5, 19, 0),
      mk("e4", "Branko", "Maus Hábitos", 10, 23, 0),
      mk("e5", "Ornatos Violeta", "Hard Club", 20, 22, 0),
    ];
  });

  const [nearestFirst, setNearestFirst] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const range = useMemo(() => {
    if (time === "all") return { start: null as Date | null, end: null as Date | null };

    if (time === "today" || time === "day") {
      const start = startOfDayLocal(now);
      const end = addDaysLocal(start, 1);
      return { start, end };
    }

    if (time === "week") {
      const start = startOfWeekMonday(now);
      const end = addDaysLocal(start, 7);
      return { start, end };
    }

    if (time === "month") {
      const start = startOfMonth(now);
      const end = startOfNextMonth(now);
      return { start, end };
    }

    const start = startOfYear(now);
    const end = startOfNextYear(now);
    return { start, end };
  }, [now, time]);

  const filtered = useMemo(() => {
    const { start, end } = range;
    if (!start || !end) return events;
    return events.filter((ev) => {
      const d = new Date(ev.datetimeISO);
      return d >= start && d < end;
    });
  }, [events, range]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const ta = new Date(a.datetimeISO).getTime();
      const tb = new Date(b.datetimeISO).getTime();
      return nearestFirst ? ta - tb : tb - ta;
    });
    return arr;
  }, [filtered, nearestFirst]);

  useEffect(() => {
    setActiveIndex(0);
    activeIndexRef.current = 0;
    setTimeout(() => {
      cardRefs.current[0]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }, 0);
  }, [time, nearestFirst]);

  useEffect(() => {
    if (activeIndex >= sorted.length) setActiveIndex(Math.max(0, sorted.length - 1));
  }, [sorted.length, activeIndex]);

  const activeEvent = sorted[activeIndex];

  function syncIndexToScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scRect = scroller.getBoundingClientRect();
    const centerX = scRect.left + scRect.width / 2;

    let bestIdx = activeIndexRef.current;
    let bestDist = Number.POSITIVE_INFINITY;

    for (let i = 0; i < sorted.length; i++) {
      const el = cardRefs.current[i];
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
  }

  function removeActive() {
    if (!activeEvent) return;
    const ok = window.confirm(`Remove "${activeEvent.title}"?\n\nAre you sure?`);
    if (!ok) return;
    setEvents((prev) => prev.filter((x) => x.id !== activeEvent.id));
  }

  const titleLine2 = time === "today" || time === "day" ? "" : copy.accent;

  return (
    <main className="relative isolate h-[100svh] overflow-hidden text-white bg-zinc-950">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img src="/bg/calendar.png" alt="" className="h-full w-full object-cover object-top" draggable={false} />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 mx-auto h-[100svh] max-w-[420px] overflow-hidden">
        {/* IMPORTANT: header stays high like before */}
        <div className="h-full px-6 pt-30 pb-28 flex flex-col">
          {/* Title */}
          <div className={`${dotGothic.className} text-center leading-[1.0]`}>
            <div className="text-[34px]">{copy.top}</div>
            {titleLine2 ? (
              <div className="text-[34px]">
                <span className="text-teal-200">{titleLine2}</span>
              </div>
            ) : null}
          </div>

          {/* Subtitle */}
          <div className={`${spaceMono.className} mt-6 text-center text-[11px] leading-4 text-white/70 whitespace-pre-line`}>
            {copy.subtitle}
          </div>

          {/* The “body” area takes remaining height and keeps content centered (less top empty space) */}
          <div className="mt-8 flex-1 flex flex-col justify-center">
            {/* Controls ABOVE scroller */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setNearestFirst((v) => !v)}
                className={`${spaceMono.className} flex-1 h-10 rounded-xl border border-white/40 bg-black/10 text-[12px] text-white/85`}
              >
                order: {nearestFirst ? "nearest → farthest" : "farthest → nearest"}
              </button>

              <button
                type="button"
                onClick={removeActive}
                disabled={!activeEvent}
                className={`${spaceMono.className} w-[120px] h-10 rounded-xl bg-white/85 text-zinc-900 text-[12px] font-semibold disabled:opacity-40`}
              >
                Remove
              </button>
            </div>

            {/* Event scroller (taller cards) */}
            <div className="mt-5 -mx-6 px-6">
              <div
                ref={scrollerRef}
                onScroll={syncIndexToScroll}
                onMouseUp={syncIndexToScroll}
                onTouchEnd={syncIndexToScroll}
                className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <style>{`
                  .no-scrollbar::-webkit-scrollbar { display: none; }
                  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>

                {sorted.length === 0 ? (
                  <div className={`${spaceMono.className} w-full text-center text-[12px] text-white/70 py-10`}>
                    No events in this range
                  </div>
                ) : (
                  sorted.map((ev, idx) => {
                    const d = new Date(ev.datetimeISO);
                    return (
                      <button
                        key={ev.id}
                        ref={(el) => {
                          cardRefs.current[idx] = el;
                        }}
                        type="button"
                        onClick={() => {
                            activeIndexRef.current = idx;
                            setActiveIndex(idx);

                            // optional: keep snap scrolling
                            cardRefs.current[idx]?.scrollIntoView({
                                behavior: "smooth",
                                inline: "center",
                                block: "nearest",
                            });

                            // go to event details page
                            router.push(`/calendar/event/${ev.id}`);
                        }}
                        className={[
                          "snap-center shrink-0",
                          "w-[240px] h-[180px] rounded-2xl",
                          "border border-white/30 bg-black/15",
                          "px-4 py-4 text-left",
                          "transition active:scale-[0.98]",
                          idx === activeIndex ? "outline outline-2 outline-white/25" : "",
                        ].join(" ")}
                      >
                        <div className={`${spaceMono.className} text-[18px] font-bold text-white`}>
                          {ev.title}
                        </div>
                        <div className={`${spaceMono.className} mt-2 text-[12px] text-white/75`}>
                          {ev.venue}
                        </div>
                        <div className={`${spaceMono.className} mt-5 text-[12px] text-white/65`}>
                          {formatTimeLocal(d)}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Date info */}
            <div className="mt-4">
              <div
                className={`${spaceMono.className} w-full rounded-full border border-white/40 bg-black/10 px-4 py-2 text-center text-[11px] text-white/85`}
              >
                {activeEvent ? formatDateLineLocal(new Date(activeEvent.datetimeISO)) : formatDateLineLocal(now)}
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
