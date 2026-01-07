import { Syne } from "next/font/google";
import BottomNav from "../components/BottomNav";


const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export default function ProfilePage() {
  return (
    <main className="min-h-dvh text-white">
      {/* Background image exported from Figma */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <img
          src="/bg/profile.png"
          alt=""
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Phone container */}
      <div className="relative mx-auto min-h-dvh max-w-[420px]">
        {/* Content */}
        <div className="px-6 pt-10 pb-28">
          {/* Name + bio */}
          <div>
            <h1
              className={`${syne.className} text-[56px] leading-[0.95] font-medium tracking-tight`}
            >
              Maria
              <br />
              Rocha
            </h1>

            <p className="mt-4 max-w-[260px] text-[13px] leading-5 text-white/70">
              Sunny beaches and marisque.
              <br />
              Music and world peace!
            </p>
          </div>

          {/* Divider */}
          <div className="mt-7 h-px w-full bg-white/20" />

          {/* Next event */}
          <section className="pt-4">
            <h2 className="text-[14px] text-white/85">next event</h2>
            <p className="mt-2 text-[12px] tracking-wide text-white/70">
              vodafone paredes de coura
            </p>
          </section>

          {/* Divider */}
          <div className="mt-5 h-px w-full bg-white/20" />

          {/* Friends */}
          <section className="pt-4">
            <h2 className="text-[14px] text-white/85">friends</h2>
            <div className="mt-3 h-11 w-28 rounded-2xl bg-white" />
          </section>

          {/* Top songs & artists */}
          <section className="pt-6">
            <h2 className="text-[14px] text-white/85">top songs and artists</h2>
            <div className="mt-3 flex gap-3">
              <div className="h-11 w-28 rounded-2xl bg-white" />
              <div className="h-11 w-44 rounded-2xl bg-white" />
            </div>
          </section>

          {/* Personal recommendations */}
          <section className="pt-6">
            <h2 className="text-[14px] text-white/85">
              personal recommendations
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="h-11 rounded-2xl bg-white" />
              <div className="h-11 rounded-2xl bg-white" />
              <div className="h-11 rounded-2xl bg-white" />
            </div>
          </section>

          {/* Photos & videos */}
          <section className="pt-6">
            <h2 className="text-[14px] text-white/85">photos &amp; videos</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="h-28 rounded-2xl bg-white" />
              <div className="h-28 rounded-2xl bg-white" />
              <div className="h-28 rounded-2xl bg-white" />
            </div>
          </section>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
