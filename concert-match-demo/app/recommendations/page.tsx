import Link from "next/link";
import BottomNav from "../components/BottomNav";
import { DotGothic16 } from "next/font/google";

const dotGothic = DotGothic16({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function RecommendationsPage() {
  return (
    <main className="min-h-dvh text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <img
          src="/bg/recomendations.png"
          alt=""
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
      </div>

      <div className="relative mx-auto min-h-dvh max-w-[420px]">
        <div className="min-h-dvh px-6 pb-28 flex items-center justify-center">
          <div
            className={`${dotGothic.className} w-full text-[50px] leading-[1.05] tracking-tight`}
          >
            <div>get</div>
            <div className="whitespace-nowrap">recommendations</div>
            <div className="whitespace-nowrap">
              by{" "}
              <Link
                href="/recommendations/real-users"
                className="text-lime-300 hover:underline underline-offset-4"
              >
                real users
              </Link>
            </div>

            <div className="mt-5 text-center">
              <Link
                href="/recommendations/genre"
                className="text-[#d7b7ff] hover:underline underline-offset-4"
              >
                genre
              </Link>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
