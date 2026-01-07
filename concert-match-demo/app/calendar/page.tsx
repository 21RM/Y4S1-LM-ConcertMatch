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

function MenuItem({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className={`${spaceMono.className} block text-center py-4 text-[15px] text-white/90 hover:text-white transition`}
    >
      {label}
    </Link>
  );
}

export default function CalendarPage() {
  return (
    <main className="relative isolate h-[100svh] overflow-hidden text-white bg-zinc-950">
  {/* Background image */}
        <div className="pointer-events-none absolute inset-0 z-0">
            <img
            src="/bg/calendar.png"
            alt=""
            className="h-full w-full object-cover object-top"
            draggable={false}
            />
            <div className="absolute inset-0 bg-black/15" />
        </div>

      <div className="relative mx-auto h-[100svh] max-w-[420px] overflow-hidden">
        {/* Content */}
        <div className="h-full px-6 pb-28 flex flex-col">
          {/* Push everything down */}
          <div className="mt-auto pb-8">
            {/* Title */}
            <div className={`${dotGothic.className} text-center`}>
              <div className="text-[42px] leading-[1.05] text-white">
                keep track
              </div>
              <div className="text-[42px] leading-[1.05] text-white">
                of <span className="text-teal-200">events</span>
              </div>
            </div>

            {/* Subtitle */}
            <div
              className={`${spaceMono.className} mt-7 text-center text-[12px] leading-4 text-white/70`}
            >
              Use the Calendar
              <br />
              to find and upload events
            </div>

            {/* Menu box */}
            <div className="mt-8">
              <div className="rounded-[22px] border border-white/60 bg-black/10 overflow-hidden">
                <MenuItem label="All events" href="/calendar/all" />
                <div className="h-px bg-white/40 mx-6" />

                <MenuItem label="Today" href="/calendar/today" />
                <div className="h-px bg-white/40 mx-6" />

                <MenuItem label="This week" href="/calendar/week" />
                <div className="h-px bg-white/40 mx-6" />

                <MenuItem label="This month" href="/calendar/month" />
                <div className="h-px bg-white/40 mx-6" />

                <MenuItem label="This year" href="/calendar/year" />
              </div>

              {/* New event button */}
              <Link
                href="/calendar/new"
                className={`${spaceMono.className} mt-6 block h-11 w-full rounded-xl bg-white/85 text-zinc-900 text-[15px] font-semibold grid place-items-center`}
              >
                New event
              </Link>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
