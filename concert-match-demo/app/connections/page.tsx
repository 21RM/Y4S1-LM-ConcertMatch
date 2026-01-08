"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../components/BottomNav";
import { DotGothic16, Space_Mono } from "next/font/google";
import QRCode from "qrcode";

const dotGothic = DotGothic16({ subsets: ["latin"], weight: "400", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

type View = "choose" | "generate" | "scan";

function makeToken(len = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function ActionButton({
  label,
  onClick,
  accent,
}: {
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        spaceMono.className,
        "h-11 w-full rounded-2xl border",
        accent
          ? "border-teal-200/70 text-teal-200 bg-black/10 hover:bg-white/5"
          : "border-white/25 text-white/85 bg-black/10 hover:bg-white/5",
        "text-[12px] tracking-tight",
        "active:scale-[0.99] transition",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function ConnectionsPage() {
  const router = useRouter();

  const [view, setView] = useState<View>("choose");
  const [origin, setOrigin] = useState<string>("");

  // stable token for this session
  const [token] = useState(() => makeToken(12));

  // set origin safely (client)
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // QR payload (absolute URL so any scanner can open it)
  const qrValue = useMemo(() => {
    if (!origin) return "";
    return `${origin}/connections/success?token=${encodeURIComponent(token)}`;
  }, [origin, token]);

  // --- QR render ---
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (view !== "generate") return;
    if (!qrValue) return;

    const canvas = qrCanvasRef.current;
    if (!canvas) return;

    QRCode.toCanvas(canvas, qrValue, {
      width: 190,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0b0b0b", light: "#ffffff" },
    }).catch(() => {});
  }, [view, qrValue]);

  // --- SCAN ---
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  function stopCamera() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function pushFromScannedValue(raw: string) {
    // If it’s our success URL, go there. Otherwise fallback to success.
    try {
      const u = new URL(raw);
      if (u.pathname === "/connections/success") {
        router.push(u.pathname + u.search);
        return;
      }
    } catch {
      // not absolute
      if (raw.startsWith("/connections/success")) {
        router.push(raw);
        return;
      }
    }
    router.push("/connections/success");
  }

  async function startScanLoop() {
    const video = videoRef.current;
    if (!video) return;

    // Prefer BarcodeDetector when available (fast)
    const hasBarcodeDetector = typeof (window as any).BarcodeDetector !== "undefined";
    const detector = hasBarcodeDetector
      ? new (window as any).BarcodeDetector({ formats: ["qr_code"] })
      : null;

    // Fallback: jsQR
    const jsqr = detector ? null : (await import("jsqr")).default;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const tick = async () => {
      // stop if left scan view
      if (view !== "scan") return;

      if (!video || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      try {
        if (detector) {
          const codes = await detector.detect(video);
          if (codes?.length) {
            const raw = codes[0]?.rawValue ?? "";
            if (raw) {
              stopCamera();
              pushFromScannedValue(raw);
              return;
            }
          }
        } else if (jsqr && ctx) {
          // draw video frame into canvas
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const res = jsqr(img.data, canvas.width, canvas.height, {
            inversionAttempts: "attemptBoth",
          });
          if (res?.data) {
            stopCamera();
            pushFromScannedValue(res.data);
            return;
          }
        }
      } catch {
        // ignore frame errors
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  async function startCamera() {
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;
      await video.play();

      startScanLoop();
    } catch {
      // Permission denied / no camera / not https
      // Fallback: just return to choose
      setView("choose");
    }
  }

  useEffect(() => {
    if (view !== "scan") {
      stopCamera();
      return;
    }
    // start camera when entering scan view
    startCamera();

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  async function copyLink() {
    if (!qrValue) return;
    try {
      await navigator.clipboard.writeText(qrValue);
    } catch {
      // ignore
    }
  }

  const titleTop = view === "choose" ? "tap to" : view === "generate" ? "show this" : "scan";
  const titleAccent = view === "choose" ? "connection" : "qrcode";

  return (
    <main className="relative isolate h-[100svh] overflow-hidden text-white bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_-20%,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>

      <div className="relative mx-auto h-[100svh] max-w-[420px] overflow-hidden">
        <div className="h-full px-6 pb-28 flex items-center justify-center text-center">
          <div className="w-full max-w-[320px]">
            {/* Title */}
            <div className={`${dotGothic.className} leading-[1.0]`}>
              <div className="text-[36px]">{titleTop}</div>
              <div className="text-[36px] text-teal-200">{titleAccent}</div>
            </div>

            {/* Subtitle */}
            <div className={`${spaceMono.className} mt-6 text-[12px] leading-4 text-white/70`}>
              {view === "choose" ? (
                <>
                  Choose how you want to connect
                  <br />
                  with your concert buddy
                </>
              ) : view === "generate" ? (
                <>
                  Let your buddy scan your code
                  <br />
                  to add you instantly
                </>
              ) : (
                <>
                  Point your camera at the QR code
                  <br />
                  to connect instantly
                </>
              )}
            </div>

            {/* CHOOSE */}
            {view === "choose" ? (
              <div className="mt-10 grid gap-3">
                <ActionButton label="GENERATE QRCODE" accent onClick={() => setView("generate")} />
                <ActionButton label="SCAN QRCODE" onClick={() => setView("scan")} />
              </div>
            ) : null}

            {/* GENERATE */}
            {view === "generate" ? (
              <div className="mt-10">
                <div className="flex justify-center">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <canvas ref={qrCanvasRef} width={190} height={190} />
                  </div>
                </div>

                <div className={`${spaceMono.className} mt-5 text-[11px] text-white/60`}>
                  token: <span className="text-white/85">{token}</span>
                </div>

                <div className="mt-4 grid gap-3">
                  <ActionButton label="COPY LINK" onClick={copyLink} />
                  <ActionButton label="BACK" onClick={() => setView("choose")} />
                </div>
              </div>
            ) : null}

            {/* SCAN */}
            {view === "scan" ? (
              <div className="mt-10">
                <div className="relative mx-auto h-[210px] w-[210px] rounded-3xl border border-white/15 bg-black/20 overflow-hidden">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    playsInline
                    muted
                  />

                  {/* scan overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(90px_circle_at_50%_30%,rgba(94,234,212,0.14),transparent_65%)]" />
                    <div className="absolute left-3 top-3 h-6 w-6 border-l border-t border-teal-200/70" />
                    <div className="absolute right-3 top-3 h-6 w-6 border-r border-t border-teal-200/70" />
                    <div className="absolute left-3 bottom-3 h-6 w-6 border-l border-b border-teal-200/70" />
                    <div className="absolute right-3 bottom-3 h-6 w-6 border-r border-b border-teal-200/70" />

                    <div className="absolute left-3 right-3 top-6 h-[2px] bg-teal-200/70 animate-[scan_1.1s_ease-in-out_infinite]" />
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  <ActionButton label="BACK" onClick={() => setView("choose")} />
                </div>

                <style jsx>{`
                  @keyframes scan {
                    0% {
                      transform: translateY(0px);
                      opacity: 0;
                    }
                    10% {
                      opacity: 1;
                    }
                    50% {
                      transform: translateY(160px);
                      opacity: 1;
                    }
                    100% {
                      transform: translateY(180px);
                      opacity: 0;
                    }
                  }
                `}</style>
              </div>
            ) : null}
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
