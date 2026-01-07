"use client";

import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";
import { DotGothic16, Space_Mono } from "next/font/google";

const dotGothic = DotGothic16({ subsets: ["latin"], weight: "400", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export default function ConnectionSuccessPage() {
  const router = useRouter();

  return (
    <main className="relative isolate h-[100svh] overflow-hidden text-white bg-zinc-950">
      {/* background */}
       <div className="pointer-events-none absolute inset-0 z-0">
            <img
            src="/bg/connection_success.png"
            alt=""
            className="h-full w-full object-cover object-top"
            draggable={false}
            />
            <div className="absolute inset-0 bg-black/15" />
        </div>

      <div className="relative mx-auto h-[100svh] max-w-[420px] overflow-hidden">
        <div className="h-full px-6 pb-28 flex items-center justify-center text-center">
          <div className="w-full max-w-[320px]">
            {/* Title */}
            <div className={`${dotGothic.className} leading-[1.0]`}>
              <div className="text-[32px]">congrats you</div>
              <div className="text-[32px]">just made a</div>
              <div className="text-[32px] text-teal-200">new connection</div>
            </div>

            {/* Avatar placeholder */}
            <div className="mt-10 flex justify-center">
              <div className="h-[110px] w-[110px] rounded-2xl bg-white" />
            </div>

            {/* Name */}
            <div className={`${spaceMono.className} mt-6 text-[28px] text-white`}>
              Afonso Reis
            </div>

            {/* Description */}
            <div className={`${spaceMono.className} mt-6 text-[11px] leading-4 text-white/70`}>
              You can now add AFONSO
              <br />
              to your friends list and
              <br />
              see their full profile
            </div>

            {/* Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className={`${spaceMono.className} h-10 px-7 rounded-full border border-teal-200/80 text-teal-200 bg-black/10`}
              >
                ADD NOW
              </button>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
