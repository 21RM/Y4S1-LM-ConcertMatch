"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomNav from "../../../components/BottomNav";
import { DotGothic16, Space_Mono } from "next/font/google";

const dotGothic = DotGothic16({ subsets: ["latin"], weight: "400", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

type EventDetails = {
  id: string;
  artist: string;
  venueTopLine: string;
  venueBottomLine: string;
  dateLine: string;
  posterSrc: string;
  titleLine: string;
  tagsLine: string;
  timePlaceLine: string;
  ageLine: string;
};

export default function EventPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "napa";

  const event = useMemo<EventDetails>(() => {
    const map: Record<string, EventDetails> = {
      e2: {
        id: "e2",
        artist: "napa",
        venueTopLine: "in Coliseu",
        venueBottomLine: "Ageas Porto",
        dateLine: "24th of January 2026, Sunday",
        posterSrc: "/posters/napa.png",
        titleLine: "NAPA | Live in the\nColusseums",
        tagsLine: "Concert | Coliseu Porto Ageas",
        timePlaceLine: "9PM GMT, Porto",
        ageLine: "6+ years old",
      },
      napa: {
        id: "napa",
        artist: "napa",
        venueTopLine: "in Coliseu",
        venueBottomLine: "Ageas Porto",
        dateLine: "24th of January 2026, Sunday",
        posterSrc: "/posters/napa.png",
        titleLine: "NAPA | Live in the\nColusseums",
        tagsLine: "Concert | Coliseu Porto Ageas",
        timePlaceLine: "9PM GMT, Porto",
        ageLine: "6+ years old",
      },
    };

    return map[id] ?? map["napa"];
  }, [id]);

  return (
    <main className="relative isolate h-[100svh] overflow-hidden text-white bg-zinc-950">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/bg/calendar_event.png"
          alt=""
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative mx-auto h-[100svh] max-w-[420px] overflow-hidden">
        <div className="h-full px-6 pt-12 pb-28 flex flex-col">
          {/* Title block */}
          <div className={`${dotGothic.className} text-center leading-[1.05]`}>
            <div className="text-[30px]">
              <span className="text-teal-200">{event.artist}</span>
            </div>
            <div className="text-[30px]">{event.venueTopLine}</div>
            <div className="text-[30px]">{event.venueBottomLine}</div>

            <div className={`${spaceMono.className} mt-3 text-[12px] text-white/70`}>
              All details bellow
            </div>
          </div>

          {/* Card */}
          <div className="mt-7 flex-1 flex items-center justify-center">
            <div className="w-full max-w-[350px] rounded-[22px] border border-white/60 bg-black/10 overflow-hidden">
              {/* date pill (bigger) */}
              <div
                className={`${spaceMono.className} px-4 py-2.5 text-[13px] text-white/90 border-b border-white/30`}
              >
                {event.dateLine}
              </div>

              {/* poster */}
              <div className="px-4 pt-4">
                <div className="rounded-xl overflow-hidden border border-white/20 bg-black/20">
                  <img
                    src={event.posterSrc}
                    alt=""
                    className="h-[165px] w-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* title under poster (bigger) */}
                <div
                  className={`${spaceMono.className} mt-3 text-[14px] leading-5 text-white/95 whitespace-pre-line text-center`}
                >
                  {event.titleLine}
                </div>
              </div>

              {/* details list (bigger) */}
              <div className="mt-3 border-t border-white/30">
                <Row text={event.tagsLine} font={spaceMono.className} />
                <Row text={event.timePlaceLine} font={spaceMono.className} />
                <Row text={event.ageLine} font={spaceMono.className} />
              </div>
            </div>
          </div>

          {/* Join forum */}
          <button
            type="button"
            onClick={() => router.push("/chats")}
            className={`${spaceMono.className} mx-auto mt-2 h-11 px-7 rounded-full border border-white/60 bg-black/10 text-[13px] tracking-[0.18em]`}
          >
            JOIN THE FORUM
          </button>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}

function Row({ text, font }: { text: string; font: string }) {
  return (
    <div className={`px-4 py-2.5 ${font} text-[13px] text-white/90 border-t border-white/20`}>
      {text}
    </div>
  );
}
