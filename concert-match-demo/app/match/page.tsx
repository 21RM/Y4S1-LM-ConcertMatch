"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DotGothic16, Space_Mono } from "next/font/google";
import BottomNav from "../components/BottomNav";

const dotGothic = DotGothic16({ subsets: ["latin"], weight: "400", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

type MatchItem = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  description: string;
};

type Vote = "like" | "pass";
type Dir = "left" | "right";

const EXIT_MS = 300;

function CircleIconButton({
  label,
  onClick,
  kind,
  disabled,
}: {
  label: string;
  onClick: () => void;
  kind: "like" | "pass";
  disabled?: boolean;
}) {
  const isLike = kind === "like";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={[
        "grid place-items-center",
        "h-[72px] w-[72px] rounded-full",
        "border border-white/70 bg-black/10",
        "active:scale-[0.98] transition",
        disabled ? "opacity-40 pointer-events-none" : "hover:bg-white/5",
      ].join(" ")}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="opacity-90" shapeRendering="crispEdges">
        {isLike ? (
          <path
            d="M20 6L9 17l-5-5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        ) : (
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        )}
      </svg>
    </button>
  );
}

function CardVisual({ item }: { item: MatchItem }) {
  return (
    <div className="w-[78vw] max-w-[340px] h-[640px] rounded-[28px] flex flex-col">
      <div className="mt-[28px] mx-[22px] rounded-[16px] bg-white/85 h-[420px] shadow-sm" />

      <div className="px-[22px] mt-[18px] text-left">
        <div className={[dotGothic.className, "text-white text-[28px] leading-[1.05]"].join(" ")}>
          {item.title}
        </div>
        <div className={[dotGothic.className, "text-red-400 text-[18px] mt-2"].join(" ")}>
          {item.subtitle}
        </div>
      </div>

      <div className="flex-1" />
    </div>
  );
}

function XButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className={[
        "absolute right-3 top-3",
        "h-10 w-10 rounded-full",
        "grid place-items-center",
        "border border-white/20 bg-black/10",
        "hover:bg-black/20 active:scale-[0.98] transition",
      ].join(" ")}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" shapeRendering="crispEdges">
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </button>
  );
}

export default function MatchPage() {
  const router = useRouter();

  const items: MatchItem[] = useMemo(
    () => [
      {
        id: "pc",
        title: "vodafone paredes\nde coura",
        subtitle: "festival",
        tags: ["indie", "eclectic", "immersive"],
        description:
          "The history of music in Portugal would not be the same without the Paredes de Coura Festival.\n\nThroughout its 30 years of existence, the oldest and most charismatic Portuguese festival has made history in discovering new musical promises and presenting the most renowned names in music worldwide.\n\nWith a careful and coherent lineup, always faithful to the alternative spirit that characterizes it…",
      },
      {
        id: "nos-alive",
        title: "nos alive",
        subtitle: "festival",
        tags: ["mainstream", "rock", "pop"],
        description:
          "Big stages, big names, and a crowd that never sleeps. NOS Alive blends pop, rock, and electronic across multiple stages near the river.",
      },
      {
        id: "sonar",
        title: "sónar lisboa",
        subtitle: "festival",
        tags: ["electronic", "avant-garde", "night"],
        description:
          "Forward-looking electronic music and digital art. A mix of club energy and experimental sounds.",
      },
      {
        id: "boom",
        title: "boom festival",
        subtitle: "festival",
        tags: ["psytrance", "nature", "community"],
        description:
          "A deep-immersion experience around music, art, sustainability, and community — designed as a temporary world.",
      },
      {
        id: "primavera",
        title: "primavera sound\nporto",
        subtitle: "festival",
        tags: ["indie", "alternative", "curated"],
        description:
          "Strong curation across indie/alt with moments of pop crossover — perfect for discovery and lineup-deep dives.",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [overlayItem, setOverlayItem] = useState<MatchItem | null>(null);
  const [votes, setVotes] = useState<Record<string, Vote>>({});

  const [exiting, setExiting] = useState<{ item: MatchItem; dir: Dir } | null>(null);
  const [exitActive, setExitActive] = useState(false);

  const [enter, setEnter] = useState(true);

  const current = items[index] ?? null;

  useEffect(() => {
    setEnter(true);
    const t = window.setTimeout(() => setEnter(false), 20);
    return () => window.clearTimeout(t);
  }, [index]);

  function registerVote(v: Vote, item: MatchItem) {
    if (!current) return;
    if (exiting) return;
    if (item.id !== current.id) return;

    const dir: Dir = v === "like" ? "right" : "left";
    const nextIndex = index + 1;

    setVotes((prev) => ({ ...prev, [item.id]: v }));
    setOverlayItem(null);

    setExiting({ item: current, dir });
    setExitActive(false);

    // immediately show next underneath
    setIndex(nextIndex);

    requestAnimationFrame(() => setExitActive(true));

    window.setTimeout(() => {
      setExiting(null);
      setExitActive(false);

      if (nextIndex >= items.length) {
        router.push("/match/discoveries");
      }
    }, EXIT_MS);
  }

  const exitStyle: React.CSSProperties | undefined = exiting
    ? {
        transform: exitActive
          ? `translateX(${exiting.dir === "right" ? "120%" : "-120%"}) rotate(${exiting.dir === "right" ? "8deg" : "-8deg"})`
          : "translateX(0%) rotate(0deg)",
        opacity: exitActive ? 0 : 1,
        transition: `transform ${EXIT_MS}ms ease-out, opacity ${EXIT_MS}ms ease-out`,
        willChange: "transform, opacity",
      }
    : undefined;

  const idleCardClass = [
    "absolute inset-0 text-left z-10",
    "transition-transform transition-opacity duration-200 ease-out",
    enter ? "opacity-0 translate-y-[10px] scale-[0.985]" : "opacity-100 translate-y-0 scale-100",
  ].join(" ");

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex-1 flex items-start justify-center pt-6 px-6">
          <div className="relative w-[78vw] max-w-[340px] h-[640px]">
            {current && (
              <button
                key={current.id}
                type="button"
                onClick={() => setOverlayItem(current)}
                className={idleCardClass}
                disabled={!!exiting}
              >
                <CardVisual item={current} />
              </button>
            )}

            {exiting && (
              <div className="absolute inset-0 z-20 pointer-events-none" style={exitStyle}>
                <CardVisual item={exiting.item} />
              </div>
            )}
          </div>
        </div>

        {/* actions — ❌ LEFT, ✅ RIGHT */}
        <div className="px-6 pb-[92px]">
          <div className="flex items-center justify-center gap-10">
            <CircleIconButton
              kind="pass"
              label="No"
              onClick={() => current && registerVote("pass", current)}
              disabled={!!exiting || (current ? !!votes[current.id] : true)}
            />
            <CircleIconButton
              kind="like"
              label="Yes"
              onClick={() => current && registerVote("like", current)}
              disabled={!!exiting || (current ? !!votes[current.id] : true)}
            />
          </div>

          <div className={[spaceMono.className, "mt-4 text-center text-white/65 text-[12px]"].join(" ")}>
            {Object.keys(votes).length}/{items.length}
          </div>
        </div>

        <BottomNav />
      </div>

      {/* popup (solid, fixed size, closes on outside or X) */}
      {overlayItem && (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <button
            type="button"
            aria-label="Close popup"
            onClick={() => setOverlayItem(null)}
            className="absolute inset-0 bg-black/60"
          />

          {/* panel */}
          <div className="absolute inset-0 flex items-start justify-center pt-[70px] px-6">
            <div
              className={[
                "relative",
                "w-[360px] max-w-[92vw] h-[520px]",
                "rounded-[28px]",
                "bg-red-700",
                "border border-white/10",
                "shadow-2xl",
                "p-5",
                "overflow-hidden",
              ].join(" ")}
              // prevent click inside panel from closing (backdrop is a button)
              onClick={(e) => e.stopPropagation()}
            >
              <XButton onClick={() => setOverlayItem(null)} />

              <div className={[dotGothic.className, "text-white text-[28px] leading-[1.05] pr-12"].join(" ")}>
                {overlayItem.title}
              </div>
              <div className={[dotGothic.className, "text-red-400 text-[18px] mt-2"].join(" ")}>
                {overlayItem.subtitle}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {overlayItem.tags.map((t) => (
                  <span
                    key={t}
                    className={[
                      spaceMono.className,
                      "px-3 py-1 rounded-full",
                      "border border-white/20",
                      "text-white/85 text-[11px]",
                    ].join(" ")}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div
                className={[
                  spaceMono.className,
                  "mt-4 text-white/80 text-[12px] leading-[1.6]",
                  "whitespace-pre-wrap",
                  "h-[360px] overflow-y-auto pr-1",
                ].join(" ")}
              >
                {overlayItem.description}
              </div>
            </div>
          </div>

          <div className="absolute left-0 right-0 bottom-0">
            <BottomNav />
          </div>
        </div>
      )}
    </div>
  );
}
