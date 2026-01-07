"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../components/BottomNav";
import { DotGothic16, Space_Mono } from "next/font/google";

const dotGothic = DotGothic16({ subsets: ["latin"], weight: "400", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

type Status = "idle" | "scanning";

export default function ConnectionsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status !== "scanning") return;
    const t = setTimeout(() => {
      router.push("/connections/success");
    }, 1400);
    return () => clearTimeout(t);
  }, [status, router]);

  function onTap() {
    if (status === "idle") setStatus("scanning");
  }

  const titleTop = status === "scanning" ? "looking for" : "tap to";
  const titleAccent = "connection";

  return (
    <main className="relative isolate h-[100svh] overflow-hidden text-white bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_-20%,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>

      <div className="relative mx-auto h-[100svh] max-w-[420px] overflow-hidden">
        <div className="h-full px-6 pb-28 flex items-center justify-center text-center">
          <div className="w-full max-w-[320px]">
            <div className={`${dotGothic.className} leading-[1.0]`}>
              <div className="text-[36px]">{titleTop}</div>
              <div className="text-[36px] text-teal-200">{titleAccent}</div>
            </div>

            <div className={`${spaceMono.className} mt-6 text-[12px] leading-4 text-white/70`}>
              Make sure your phone is near
              <br />
              your concert buddy&apos;s phone
            </div>

            <button
              type="button"
              onClick={onTap}
              className="mt-25 relative mx-auto grid place-items-center"
              aria-label="Connection"
            >
              <div
                className={[
                  "absolute h-[180px] w-[180px] rounded-full blur-2xl",
                  status === "scanning" ? "bg-teal-200/55" : "bg-teal-200/0",
                ].join(" ")}
              />

              {status === "scanning" ? (
                <span className="absolute h-[150px] w-[150px] rounded-full border border-teal-200/25 animate-ping" />
              ) : null}

              <img
                src="/sprites/fingerprint.png"
                alt=""
                draggable={false}
                className="h-[120px] w-[120px] object-contain select-none relative opacity-90"
              />
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
