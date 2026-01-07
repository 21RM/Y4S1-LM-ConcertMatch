"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";
import { DotGothic16, Space_Mono } from "next/font/google";

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

export default function GenrePage() {
  const router = useRouter();

  const genres = useMemo(
    () => [
      "rock",
      "pop",
      "hip hop",
      "classical",
      "jazz",
      "funk",
      "alternative",
      "indie",
      "heavy metal",
      "techno",
      "latin pop",
      "reggaeton",
      "k-pop",
      "j-pop",
      "gospel",
    ],
    []
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  function toggle(g: string) {
    setError("");
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  }

  function onSeeRecommendations() {
    if (selected.size === 0) {
      setError("Select at least one genre.");
      return; // break
    }

    // Later you'll implement this page. For now we just navigate somewhere placeholder.
    // You can change this to whatever route you create later.
    router.push(
    `/recommendations/genre/results?g=${encodeURIComponent(
        Array.from(selected).join(",")
    )}`
    );
  }

  return (
    <main className="min-h-dvh text-white bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(700px_circle_at_60%_-10%,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="relative mx-auto min-h-dvh max-w-[420px]">
        <div className="min-h-dvh px-6 pt-10 pb-28 flex flex-col">
          {/* Title */}
          <div className={`${dotGothic.className} leading-[1.02]`}>
            <div className="text-[34px]">hand-picked</div>
            <div className="text-[34px]">recommendations</div>
            <div className="text-[34px] text-[#d7b7ff]">by genre.</div>
          </div>

          {/* Subtext with underline vibe */}
          <div className="mt-4">
            <div className={`${spaceMono.className} text-[12px] text-white/75`}>
                select one or more
                <br />
                music genres
            </div>
          </div>

          {/* Pills */}
          <div className="mt-7 flex-1">
            <div className="flex flex-wrap gap-3">
              {genres.map((g) => {
                const isOn = selected.has(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggle(g)}
                    className={[
                      `${spaceMono.className}`,
                      "px-4 py-2 rounded-full text-[18px] leading-none transition",
                      "border",
                      isOn
                        ? "border-white/80 bg-white/15 text-white"
                        : "border-white/40 bg-transparent text-white/80 hover:border-white/70",
                    ].join(" ")}
                    aria-pressed={isOn}
                  >
                    {g}
                  </button>
                );
              })}
            </div>

            {/* error */}
            {error && (
              <div className={`${spaceMono.className} mt-4 text-[11px] text-red-300`}>
                {error}
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={onSeeRecommendations}
            className="mt-6 flex items-center gap-2 text-left"
          >
            <div className={`${dotGothic.className} text-[#d7b7ff] text-[22px] leading-5`}>
              see the
              <br />
              recommendations
            </div>
            <div className={`${dotGothic.className} text-[#d7b7ff] text-[28px] leading-none`}>
              &gt;
            </div>
          </button>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
