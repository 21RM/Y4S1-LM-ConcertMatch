"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

type Msg = {
  id: string;
  side: "left" | "right";
  text: string;
};

export default function ChatForumPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const forum = useMemo(() => {
    const id = params?.id ?? "1";
    if (id === "1") {
      return {
        title: "NAPA",
        venue: "Coliseu Ageas Porto",
        date: "24th of january 2026",
      };
    }
    return {
      title: "FORUM",
      venue: "Unknown venue",
      date: "Unknown date",
    };
  }, [params?.id]);

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "m1",
      side: "left",
      text: "👋 Hi there! At what time are you guys thinking about arriving at the venue?",
    },
    { id: "m2", side: "right", text: "i have no idea!" },
    { id: "m3", side: "right", text: "We should be there earlier i think?" },
  ]);

  const [draft, setDraft] = useState("");

  function send() {
    const t = draft.trim();
    if (!t) return;
    setMessages((prev) => [
      ...prev,
      { id: `m${prev.length + 1}`, side: "right", text: t },
    ]);
    setDraft("");
  }

  function leaveForum() {
    router.push("/chats");
  }

  return (
    <main className="h-[100svh] overflow-hidden bg-zinc-950 text-white">
      <div className="relative mx-auto h-[100svh] max-w-[420px] overflow-hidden">
        {/* Header */}
        <div className="bg-teal-200 text-zinc-900">
          <div className="px-4 pt-3 pb-2 relative">
            {/* back (left) */}
            <button
              type="button"
              onClick={() => router.push("/chats")}
              className={`${dotGothic.className} absolute left-3 top-3 text-[22px] leading-none`}
              aria-label="Back"
            >
              &lt;
            </button>

            {/* leave forum (right) */}
            <button
              type="button"
              onClick={leaveForum}
              className={`${spaceMono.className} absolute right-3 top-3 text-[11px] text-zinc-900/70 hover:text-zinc-900 transition underline underline-offset-4`}
              aria-label="Leave forum"
            >
              leave
            </button>

            {/* centered title block */}
            <div className="text-center">
              <div className={`${spaceMono.className} text-[22px] font-bold`}>
                {forum.title}
              </div>
              <div className={`${spaceMono.className} text-[11px] opacity-80`}>
                {forum.venue}
              </div>
              <div className={`${spaceMono.className} text-[11px] opacity-80`}>
                {forum.date}
              </div>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="h-full overflow-y-auto px-4 pt-4 pb-[160px]">
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.side === "left" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={[
                    "max-w-[78%] rounded-xl px-4 py-3",
                    m.side === "left"
                      ? "bg-white text-zinc-900"
                      : "bg-teal-200 text-zinc-900",
                  ].join(" ")}
                >
                  <div className={`${spaceMono.className} text-[12px] leading-5`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply bar */}
        <div className="absolute left-0 right-0 bottom-16">
          <div className="px-4">
            <div className="h-px w-full bg-white/20 mb-3" />

            <div className="flex items-center gap-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="Type a reply..."
                className={`${spaceMono.className} flex-1 bg-transparent text-white/70 placeholder:text-white/40 outline-none text-[12px]`}
              />

              <button
                type="button"
                onClick={send}
                className={`${spaceMono.className} text-[12px] text-white/70 hover:text-white transition`}
                aria-label="Send"
              >
                send
              </button>
            </div>

            <div className="mt-3 h-px w-full bg-white/20" />
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
