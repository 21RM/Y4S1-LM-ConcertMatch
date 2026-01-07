"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";
import { DotGothic16, Space_Mono } from "next/font/google";

const dotGothic = DotGothic16({ subsets: ["latin"], weight: "400", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

type FormState = {
  name: string;
  type: string;
  artist: string;
  date: string;
  place: string;
  coverUrl?: string;
};

const TYPES = ["Concert", "Festival", "Meetup", "Party"] as const;

export default function NewEventPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    type: "",
    artist: "",
    date: "",
    place: "",
    coverUrl: undefined,
  });

  const [error, setError] = useState("");

  const needsArtist = useMemo(() => form.type === "Concert", [form.type]);

  function pickCover() {
    fileRef.current?.click();
  }

  function onCoverPicked(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setForm((p) => ({ ...p, coverUrl: url }));
  }

  function setField<K extends keyof FormState>(k: K, v: FormState[K]) {
    setError("");
    setForm((p) => ({ ...p, [k]: v }));
  }

  function onUpload() {
    const missing: string[] = [];

    if (!form.name.trim()) missing.push("Name");
    if (!form.type.trim()) missing.push("Type");
    if (needsArtist && !form.artist.trim()) missing.push("Artist");
    if (!form.date.trim()) missing.push("Date");
    if (!form.place.trim()) missing.push("Local");

    if (missing.length) {
      setError(`Fill: ${missing.join(", ")}.`);
      return; // break
    }

    // demo: go back to calendar month list
    router.push("/calendar/month");
  }

  return (
    <main className="relative isolate h-[100svh] overflow-hidden text-white bg-zinc-950">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/bg/calendar_new.png"
          alt=""
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative mx-auto h-[100svh] max-w-[420px] overflow-hidden">
        <div className="h-full px-6 pt-12 pb-28 flex flex-col">
          {/* Title */}
          <div className={`${dotGothic.className} text-center leading-[1.0]`}>
            <div className="text-[34px]">create</div>
            <div className="text-[34px]">
              new <span className="text-teal-200">events</span>
            </div>
          </div>

          {/* Subtitle */}
          <div
            className={`${spaceMono.className} mt-5 text-center text-[11px] leading-4 text-white/70`}
          >
            Fill all the information about this
            <br />
            event so it can be shared
          </div>

          {/* Form box */}
          <div className="mt-7 flex-1 flex items-center justify-center">
            <div className="w-full max-w-[360px] rounded-[24px] border border-white/55 bg-black/10 overflow-hidden">
              <Row
                label="Name of event"
                value={form.name}
                placeholder="Fill this field"
                onChange={(v) => setField("name", v)}
              />
              <Divider />

              <SelectRow
                label="Type of event"
                value={form.type}
                placeholder="Fill this field"
                options={TYPES as unknown as string[]}
                onChange={(v) => setField("type", v)}
              />
              <Divider />

              <div className="px-5 pt-2 text-[10px] text-white/70">
                <span className={spaceMono.className}>
                  *If chosen “Concert”, name the artist*
                </span>
              </div>
              <Row
                label=""
                value={form.artist}
                placeholder="Fill this field"
                onChange={(v) => setField("artist", v)}
                disabled={!needsArtist}
              />
              <Divider />

              <Row
                label="Date of event"
                value={form.date}
                placeholder="Fill this field"
                onChange={(v) => setField("date", v)}
                type="datetime-local"
              />
              <Divider />

              <Row
                label="Local of event"
                value={form.place}
                placeholder="Fill this field"
                onChange={(v) => setField("place", v)}
              />

              {/* Cover row */}
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div className={`${dotGothic.className} text-[14px] text-white/90`}>
                  Add a cover
                </div>

                <div className="flex items-center gap-3">
                  {form.coverUrl ? (
                    <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/25 bg-white/10">
                      <img
                        src={form.coverUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={pickCover}
                    className="h-10 w-28 rounded-2xl border border-white/55 bg-black/10 grid place-items-center"
                    aria-label="Add cover"
                  >
                    <span className={`${dotGothic.className} text-[30px] leading-none`}>
                      +
                    </span>
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onCoverPicked(e.target.files)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error ? (
            <div className={`${spaceMono.className} -mt-2 mb-2 text-center text-[11px] text-red-300`}>
              {error}
            </div>
          ) : null}

          {/* Upload */}
          <button
            type="button"
            onClick={onUpload}
            className={`${spaceMono.className} mx-auto h-10 w-full max-w-[360px] rounded-xl bg-white/85 text-zinc-900 text-[14px] font-semibold`}
          >
            Upload
          </button>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}

/** Reusable pieces */

function Divider() {
  return <div className="h-px w-full bg-white/25" />;
}

function Row({
  label,
  value,
  placeholder,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  type?: "text" | "datetime-local";
}) {
  return (
    <div className="px-5 py-4">
      {label ? (
        <div className={`${dotGothic.className} text-[14px] text-white/90`}>
          {label}
        </div>
      ) : null}

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        type={type}
        className={[
          spaceMono.className,
          "mt-2 w-full bg-transparent outline-none text-[12px] text-white/85",
          "placeholder:text-white/45",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "text-right",
        ].join(" ")}
      />
    </div>
  );
}

function SelectRow({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="px-5 py-4">
      <div className={`${dotGothic.className} text-[14px] text-white/90`}>
        {label}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          spaceMono.className,
          "mt-2 w-full bg-transparent outline-none text-[12px] text-white/85",
          "text-right",
        ].join(" ")}
      >
        <option value="" className="text-black">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-black">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
