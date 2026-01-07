"use client";

import { useRef, useState } from "react";
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

type MediaItem = {
  url: string;
  type: string;
};

export default function CreateRecommendationPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [text, setText] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string>("");

  function onPickFiles(files: FileList | null) {
    if (!files) return;

    const remaining = Math.max(0, 4 - media.length);
    if (remaining === 0) return;

    const picked = Array.from(files).slice(0, remaining);
    const newItems: MediaItem[] = picked.map((f) => ({
      url: URL.createObjectURL(f),
      type: f.type,
    }));

    setMedia((prev) => [...prev, ...newItems]);
  }

  function openPicker() {
    fileRef.current?.click();
  }

  function removeMediaAt(index: number) {
    setMedia((prev) => {
        const item = prev[index];
        if (item?.url) URL.revokeObjectURL(item.url); // cleanup
        return prev.filter((_, i) => i !== index);
    });
  }

  function onUpload() {
    if (text.trim().length === 0) {
      setError("Please write something before uploading.");
      return;
    }
    setError("");
    router.push("/recommendations/real-users");
  }

  return (
    <main className="min-h-dvh text-white bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(700px_circle_at_50%_-10%,rgba(255,255,255,0.10),transparent_60%)]" />

      <div className="relative mx-auto min-h-dvh max-w-[420px]">
        <div className="min-h-dvh px-6 pt-10 pb-28 flex flex-col">
          {/* Title */}
          <div className={`${dotGothic.className} text-center leading-[1.02]`}>
            <div className="text-[40px]">create a new</div>
            <div className="text-[40px] text-lime-300">recommendation</div>
          </div>

          {/* Subtitle */}
          <div
            className={`${spaceMono.className} mt-4 text-center text-[11px] leading-4 text-white/70`}
          >
            Fill all the information about this
            <br />
            event so it can be shared
          </div>

          {/* Big input box */}
          <div className="mt-6 flex-1 flex">
            <div className="w-full rounded-[28px] border border-white/40 bg-black/10 px-5 pt-5 pb-4 flex flex-col">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (error) setError("");
                }}
                placeholder="write your recommendation here..."
                className={`${spaceMono.className} flex-1 resize-none bg-transparent outline-none text-[14px] leading-6 placeholder:text-white/50`}
              />

              {/* Media area: Row 1 = squares, Row 2 = label + plus */}
                <div className="mt-4">
                <div className="flex justify-center">
                <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => {
                    const m = media[i];

                    return (
                        <div
                        key={i}
                        className="relative h-14 w-14 rounded-xl bg-white/10 border border-white/20 overflow-hidden"
                        title={m?.type ?? ""}
                        >
                        {m ? (
                            <>
                            <img
                                src={m.url}
                                alt=""
                                className="h-full w-full object-cover"
                                draggable={false}
                            />

                            {/* Remove X */}
                            <button
                                type="button"
                                onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeMediaAt(i);
                                }}
                                className={`${dotGothic.className} absolute right-1 top-1 h-6 w-6 grid place-items-center rounded-md border border-white/70 bg-black/40 text-white text-[14px] leading-none`}
                                aria-label={`Remove media ${i + 1}`}
                            >
                                X
                            </button>
                            </>
                        ) : null}
                        </div>
                    );
                    })}
                </div>
                </div>

            {/* Row 2: label + button (one row) */}
            <div className="mt-3 flex items-center gap-4">
                {/* label takes remaining space and is centered */}
                <div className="flex-1 flex justify-center">
                <div className={`${spaceMono.className} text-[18px] leading-none text-white/80`}>
                    Add media
                </div>
                </div>

                {/* + button on the right */}
                <div className="shrink-0 flex items-center">
                <button
                    type="button"
                    onClick={openPicker}
                    className="h-12 w-28 rounded-2xl border border-white/50 bg-black/10 grid place-items-center"
                    aria-label="Add media"
                >
                    {/* tiny nudge so it looks optically centered */}
                    <span className={`${dotGothic.className} text-[32px] leading-none relative -top-[2px]`}>
                    +
                    </span>
                </button>

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onPickFiles(e.target.files)}
                />
                </div>
            </div>
            </div>

            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className={`${spaceMono.className} mt-3 text-center text-[11px] text-red-300`}
            >
              {error}
            </div>
          )}

          {/* Upload */}
          <button
            type="button"
            onClick={onUpload}
            className={`${spaceMono.className} mt-5 h-10 w-full rounded-xl bg-white/90 text-zinc-900 text-[14px] font-semibold`}
          >
            Upload
          </button>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
