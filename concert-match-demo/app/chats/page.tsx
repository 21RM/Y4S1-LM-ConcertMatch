import Link from "next/link";
import BottomNav from "../components/BottomNav";
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

type Forum = {
  id: string;
  artist: string;
  venue: string;
};

const forums: Forum[] = [
  { id: "1", artist: "napa", venue: "Coliseu Ageas Porto" },
  { id: "2", artist: "Arctic Monkeys", venue: "Altice Arena Lisboa" },
  { id: "3", artist: "Slow J", venue: "Super Bock Arena" },
  { id: "4", artist: "Billie Eilish", venue: "MEO Arena" },
  { id: "5", artist: "Bad Bunny", venue: "Estádio do Dragão" },
  { id: "6", artist: "Daft Punk", venue: "Paris La Défense Arena" },
  { id: "7", artist: "The Weeknd", venue: "Estádio da Luz" },
  { id: "8", artist: "Rosalía", venue: "Coliseu dos Recreios" },
];

function RightArrow() {
  return (
    <span className={`${dotGothic.className} text-[22px] leading-none text-white/80`}>
      ----&gt;
    </span>
  );
}

export default function ChatsPage() {
  return (
    <main className="h-[100svh] overflow-hidden text-white bg-zinc-950">
      <div className="relative mx-auto h-[100svh] max-w-[420px] overflow-hidden">
        <div className="h-full overflow-y-auto pb-28">
          {/* Title */}
          <div className="px-6 pt-10 pb-6">
            <h1 className={`${dotGothic.className} text-[34px] leading-none`}>
              active forums
            </h1>
          </div>

          {/* List */}
          <div className="border-t border-white/20">
            {forums.map((f) => (
              <Link
                key={f.id}
                href={`/chats/${f.id}`}
                className="block border-b border-white/20"
              >
                <div className="px-6 py-5 flex items-center justify-between">
                  <div>
                    {/* Chat title now Space Mono */}
                    <div
                      className={`${spaceMono.className} text-[22px] leading-none text-teal-300 font-bold`}
                    >
                      {f.artist.toLowerCase()}
                    </div>

                    {/* Venue */}
                    <div
                      className={`${spaceMono.className} mt-2 text-[12px] leading-none text-white/90`}
                    >
                      {f.venue}
                    </div>
                  </div>

                  <RightArrow />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
