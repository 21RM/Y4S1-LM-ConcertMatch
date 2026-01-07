"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  src: string;
  label: string;
  match?: "exact" | "startsWith";
};

const NAV: NavItem[] = [
  { href: "/archive", src: "/icons/Archive.png", label: "Archive" },
  { href: "/calendar", src: "/icons/Calender.png", label: "Calender" },
  {
    href: "/recommendations",
    src: "/icons/Recomendations.png",
    label: "Recomendations",
    match: "startsWith",
  },
  { href: "/match", src: "/icons/Match.png", label: "Match" },
  { href: "/connections", src: "/icons/Connections.png", label: "Connections" },
  { href: "/chats", src: "/icons/Chats.png", label: "Chats" },
  { href: "/profile", src: "/icons/Profile.png", label: "Profile" },
];

function isActive(pathname: string, item: NavItem) {
  const mode = item.match ?? "exact";
  return mode === "startsWith"
    ? pathname === item.href || pathname.startsWith(item.href + "/")
    : pathname === item.href;
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 border-t border-white/20 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto max-w-[420px] px-4 py-3">
        <div className="flex items-center justify-between">
          {NAV.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className={`grid place-items-center p-2 transition ${
                  active ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="h-6 w-6 object-contain"
                  draggable={false}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
