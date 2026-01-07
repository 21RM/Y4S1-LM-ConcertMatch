import { DotGothic16, Space_Mono } from "next/font/google";
import BottomNav from "../../components/BottomNav";

const dotGothic = DotGothic16({ subsets: ["latin"], weight: "400", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

function PlaceholderCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "shrink-0 rounded-2xl bg-zinc-200/90 shadow-sm",
        "border border-white/10",
        className,
      ].join(" ")}
    />
  );
}

function Row({
  title,
  cardClassName,
  count = 5,
}: {
  title: string;
  cardClassName: string;
  count?: number;
}) {
  return (
    <section>
      <div className={[spaceMono.className, "text-white/80 text-[14px] mb-3"].join(" ")}>
        {title}
      </div>

      <div
        className={[
          "flex gap-4",
          "overflow-x-auto",
          "pb-2",
          "scrollbar-none",
          "snap-x snap-mandatory",
        ].join(" ")}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="snap-start">
            <PlaceholderCard className={cardClassName} />
          </div>
        ))}

        {/* right padding so last card can breathe */}
        <div className="shrink-0 w-2" />
      </div>
    </section>
  );
}

export default function MatchDiscoveriesPage() {
  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 px-6 pt-10 pb-[92px]">
          {/* title */}
          <div className={[dotGothic.className, "text-white text-[44px] leading-[0.95]"].join(" ")}>
            <div>based on</div>
            <div>your likes,</div>
            <div>here are</div>
            <div>
              <span className="text-red-500">your</span> <span className="text-red-500">discoveries</span>
            </div>
          </div>

          {/* rows */}
          <div className="mt-10 space-y-10">
            <Row title="events" cardClassName="h-[72px] w-[92px]" count={5} />
            <Row title="bands and artists" cardClassName="h-[72px] w-[92px]" count={5} />
            <Row title="videos" cardClassName="h-[170px] w-[92px]" count={5} />
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
