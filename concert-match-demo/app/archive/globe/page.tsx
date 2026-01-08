"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DotGothic16, Space_Mono } from "next/font/google";
import BottomNav from "../../components/BottomNav";

const dotGothic = DotGothic16({ subsets: ["latin"], weight: "400", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

type CityPin = {
  name: string;
  slug: string;
  lat: number;
  lon: number;
  hasMedia: boolean;
};

// ✅ YOU ONLY EDIT THESE TWO UNTIL IT LOOKS PERFECT
const PIN_NUDGE_X = -110; // + moves right, - moves left
const PIN_NUDGE_Y = 45; // + moves down,  - moves up

// texture size (only for aspect)
const TEX_W = 4869;
const TEX_H = 2404;

// square viewBox
const VIEW = 360;

// zoom (keep whatever you want)
const ZOOM = 5;

// keep correct proportions
const ASPECT = TEX_W / TEX_H;
const IMG_H = VIEW * ZOOM;
const IMG_W = IMG_H * ASPECT;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
function wrap360(d: number) {
  return mod(d, 360);
}
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

// Mercator Y (common for world PNGs)
const MAX_MERCATOR_LAT = 85.05112878;
function mercatorY01(latDeg: number) {
  const lat = clamp(latDeg, -MAX_MERCATOR_LAT, MAX_MERCATOR_LAT) * (Math.PI / 180);
  const a = Math.log(Math.tan(Math.PI / 4 + lat / 2));
  return (1 - a / Math.PI) / 2; // 0..1
}

function projectToImg(lat: number, lon: number) {
  const x = ((lon + 180) / 360) * IMG_W;
  const y = mercatorY01(lat) * IMG_H;
  return { x, y };
}

export default function ArchivesGlobePage() {
  const router = useRouter();

  const pins: CityPin[] = useMemo(
    () => [{ name: "Porto", slug: "porto", lat: 41.1579, lon: -8.6291, hasMedia: true }],
    []
  );

  // horizontal spin (wraps)
  const [lonOff, setLonOff] = useState(14);

  // vertical pan in viewBox units
  const baseCenterTy = (VIEW - IMG_H) / 2;
  const [ty, setTy] = useState(baseCenterTy);

  const dragRef = useRef<{
    down: boolean;
    startX: number;
    startY: number;
    startLon: number;
    startTy: number;
  }>({ down: false, startX: 0, startY: 0, startLon: 0, startTy: 0 });

  const tx = -((lonOff / 360) * IMG_W);
  const xShifts = [-IMG_W, 0, IMG_W];

  function onPointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      down: true,
      startX: e.clientX,
      startY: e.clientY,
      startLon: lonOff,
      startTy: ty,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current.down) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    const degPerPxX = 0.55;
    const pxPerPxY = 1.0;

    setLonOff(wrap360(dragRef.current.startLon - dx * degPerPxX));
    setTy(clamp(dragRef.current.startTy + dy * pxPerPxY, VIEW - IMG_H, 0));
  }

  function onPointerUp() {
    dragRef.current.down = false;
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const kx = 0.08;
    const ky = 0.9;
    setLonOff((v) => wrap360(v + e.deltaX * kx));
    setTy((v) => clamp(v + e.deltaY * ky, VIEW - IMG_H, 0));
  }

  function goCity(slug: string) {
    router.push(`/archive/city/${slug}`);
  }

  // Optional: center the view on Porto once (keeps your “spawn near Porto” feel)
  const didCenter = useRef(false);
  useEffect(() => {
    if (didCenter.current) return;
    const p = pins.find((x) => x.hasMedia) ?? pins[0];
    if (!p) return;

    const { x: x0, y: y0 } = projectToImg(p.lat, p.lon);

    // center pin
    const desiredTx = VIEW / 2 - x0;
    const lon = -(desiredTx / IMG_W) * 360;
    setLonOff(wrap360(lon));

    setTy(clamp(VIEW / 2 - y0, VIEW - IMG_H, 0));

    didCenter.current = true;
  }, [pins]);

  // ✅ pins: wrap horizontally only, then apply your two nudges
  const pinPositions = useMemo(() => {
    const out: Array<{ slug: string; name: string; x: number; y: number }> = [];

    for (const p of pins) {
      if (!p.hasMedia) continue;

      const { x: x0, y: y0 } = projectToImg(p.lat, p.lon);

      const baseX = x0 + tx;
      const baseY = y0 + ty;

      for (const sx of xShifts) {
        let x = baseX + sx + PIN_NUDGE_X;
        let y = baseY + PIN_NUDGE_Y;

        if (x >= 0 && x <= VIEW && y >= 0 && y <= VIEW) {
          out.push({ slug: p.slug, name: p.name, x, y });
          break;
        }
      }
    }

    return out;
  }, [pins, tx, ty]);

  const [enter, setEnter] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setEnter(false), 20);
    return () => window.clearTimeout(t);
  }, []);

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
        <div className="flex-1 px-6 pb-[92px] flex flex-col items-center justify-center">
          <div
            className={[
              dotGothic.className,
              "text-white text-[44px] leading-[0.95] text-center",
              enter ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
              "transition-all duration-200 ease-out",
            ].join(" ")}
          >
            <div>drag to</div>
            <div className="text-purple-200">find</div>
          </div>

          <div className={[spaceMono.className, "mt-3 text-white/70 text-[12px] text-center"].join(" ")}>
            Use the Archive Globe
            <br />
            to find events
          </div>

          <div className="mt-6 flex justify-center">
            <div
              className="relative h-[330px] w-[330px] rounded-full overflow-hidden border border-white/20 select-none"
              style={{ touchAction: "none" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onWheel={onWheel}
            >
              <div className="absolute inset-0 bg-black" />

              <svg className="absolute inset-0" viewBox={`0 0 ${VIEW} ${VIEW}`} preserveAspectRatio="none">
                {xShifts.map((sx) => (
                  <image
                    key={sx}
                    href="/sprites/earth.png"
                    xlinkHref="/sprites/earth.png"
                    x={tx + sx}
                    y={ty}
                    width={IMG_W}
                    height={IMG_H}
                    preserveAspectRatio="none"
                  />
                ))}

                {pinPositions.map((p) => (
                  <g key={p.slug} transform={`translate(${p.x}, ${p.y})`}>
                    <circle r="2.8" fill="#ff2b2b" />
                    <circle
                      r="7"
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onClick={() => goCity(p.slug)}
                    />
                    <title>{p.name}</title>
                  </g>
                ))}
              </svg>

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),transparent_55%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_70%,rgba(0,0,0,0.60),transparent_55%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.55))]" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10 rounded-full" />
            </div>
          </div>

          <div className={[spaceMono.className, "mt-5 text-center text-white/40 text-[11px]"].join(" ")}>
            tip: drag any direction
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
