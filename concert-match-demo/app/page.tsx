"use client";

import Image from "next/image";
import { DotGothic16, Syne } from "next/font/google";
import { useRouter } from "next/navigation";

const dotGothic = DotGothic16({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.365 1.43c0 1.14-.47 2.2-1.22 3.04-.78.9-2.08 1.6-3.28 1.5-.15-1.1.43-2.26 1.16-3.07.8-.9 2.2-1.56 3.34-1.47ZM20.8 17.2c-.4.92-.6 1.33-1.12 2.14-.73 1.14-1.76 2.56-3.03 2.57-1.13.01-1.42-.74-2.95-.73-1.53.01-1.86.75-2.99.74-1.27-.01-2.24-1.28-2.97-2.41-2.05-3.17-2.27-6.89-1-8.88.9-1.41 2.33-2.24 3.66-2.24 1.16 0 1.89.8 2.85.8.93 0 1.49-.81 2.84-.81 1.18 0 2.43.65 3.32 1.77-2.9 1.59-2.43 5.78.39 7.15Z" />
    </svg>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.647 32.657 29.194 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 16.108 19.01 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.094 0 9.795-1.957 13.328-5.143l-6.157-5.207C29.11 35.588 26.693 36 24 36c-5.173 0-9.612-3.318-11.279-7.946l-6.52 5.024C9.518 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.799 2.215-2.337 4.07-4.132 5.248l.001-.001 6.157 5.207C36.89 39.338 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.143 0-7.5 2.239-7.5 5v.75h15v-.75c0-2.761-3.357-5-7.5-5Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function AuthButton({
  leftIcon,
  children,
  onClick,
}: {
  leftIcon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full rounded-full
        bg-white/5 hover:bg-white/10
        border border-white/10
        backdrop-blur
        px-4 py-3.5
        flex items-center gap-3
        text-white/90
        transition
      "
    >
      <span className="w-6 h-6 grid place-items-center">{leftIcon}</span>
      <span className="flex-1 text-center text-sm font-medium">{children}</span>
      <span className="w-6 h-6" />
    </button>
  );
}

export default function Page() {

  const router = useRouter();

  return (
    <main className="min-h-dvh text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(700px_circle_at_50%_-10%,rgba(255,255,255,0.14),transparent_60%)]" />

      <div className="relative mx-auto min-h-dvh max-w-[420px] px-6 py-10 flex flex-col">
        <div className="flex flex-col items-center pt-10">
          {/* Bigger logo */}
          <div className="mb-6">
            <Image
              src="/logo.png"
              alt="ConcertMatch logo"
              width={200}
              height={200}
              priority
              className="h-[200px] w-[200px] object-contain drop-shadow"
            />
          </div>

          {/* Smaller title */}
          <h1
            className={`${syne.className} text-[32px] leading-none font-extrabold tracking-tight`}
          >
            ConcertMatch
          </h1>

          <p
            className={`${dotGothic.className} mt-3 text-center text-[15px] leading-5 text-white/65`}
          >
            experience the true sense
            <br />
            of music and community
          </p>
        </div>

        <div className="mt-auto pb-6">
          <div className="space-y-3">
            <AuthButton leftIcon={<AppleIcon className="h-5 w-5 text-white" />}
             onClick={() => router.push("/profile")}>
              Continue with Apple
            </AuthButton>

            <AuthButton leftIcon={<GoogleIcon className="h-5 w-5" />}
             onClick={() => router.push("/profile")}>
              Continue with Google
            </AuthButton>

            {/* Third button icon centered */}
            <AuthButton leftIcon={<UserIcon className="h-5 w-5 mx-auto text-white/90" />}
             onClick={() => router.push("/profile")}>
              Phone or Email
            </AuthButton>
          </div>
        </div>
      </div>
    </main>
  );
}
