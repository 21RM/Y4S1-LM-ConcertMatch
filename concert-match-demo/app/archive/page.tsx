"use client";

import Link from "next/link";
import BottomNav from "../components/BottomNav";
import { DotGothic16, Space_Mono } from "next/font/google";

const dotGothic = DotGothic16({ subsets: ["latin"], weight: "400", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.1" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path
        d="M12 3c2.8 2.5 4.5 5.9 4.5 9s-1.7 6.5-4.5 9c-2.8-2.5-4.5-5.9-4.5-9S9.2 5.5 12 3Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.1" />
      <path d="M12 6.7v5.6l3.4 2.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export default function ArchivePage() {
  return (
    <main className="relative isolate h-[100svh] overflow-hidden text-white bg-zinc-950">
      {/* Background image from figma */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/bg/archive.png"
          alt=""
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative mx-auto h-[100svh] max-w-[420px] overflow-hidden">
        <div className="h-full px-6 pb-28 flex items-center justify-center text-center">
          <div className="w-full max-w-[340px]">
            {/* Title */}
            <div className={`${dotGothic.className} leading-[1.0]`}>
              <div className="text-[36px]">chose to</div>
              <div className="text-[36px] text-[#d7b7ff]">discover</div>
            </div>

            {/* Subtitle */}
            <div className={`${spaceMono.className} mt-6 text-[11px] leading-4 text-white/70`}>
              Use the Archive pages
              <br />
              to find events
            </div>

            {/* Options */}
            <div className="mt-14 grid grid-cols-2 gap-10">
              <Link href="/archive/globe" className="flex flex-col items-center gap-3">
                <div className="grid place-items-center text-[#d7b7ff]">
                  <GlobeIcon className="h-[112px] w-[112px]" />
                </div>
                <div className={`${spaceMono.className} text-[13px] text-white/90`}>Globe</div>
              </Link>

              <Link href="/archive/timeline" className="flex flex-col items-center gap-3">
                <div className="grid place-items-center text-[#d7b7ff]">
                  <ClockIcon className="h-[112px] w-[112px]" />
                </div>
                <div className={`${spaceMono.className} text-[13px] text-white/90`}>Timeline</div>
              </Link>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
