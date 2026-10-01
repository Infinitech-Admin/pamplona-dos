import Link from "next/link";

// Palette: deep green base, orange as a small accent (same as the other sections)
const GREEN_DARK = "#124A1F";
const GREEN = "#1F6B2E";
const ORANGE = "#F47B20";

// No "use client" and no framer-motion on purpose: the text is part of the
// server-rendered HTML, so it is visible immediately, even before JavaScript
// loads. Nothing starts at opacity 0, so there is no empty green screen.
export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-[600px] items-center overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8"
      style={{
        backgroundColor: GREEN_DARK,
        backgroundImage: `radial-gradient(ellipse at 85% 20%, ${GREEN} 0%, transparent 60%), linear-gradient(135deg, ${GREEN_DARK} 0%, ${GREEN} 100%)`,
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-3xl">
          <span
            className="mb-6 block h-1 w-14 rounded-full"
            style={{ backgroundColor: ORANGE }}
          />

          <p className="mb-4 text-base font-semibold text-white/80 md:text-lg">
            Welcome to Barangay Pamplona Dos
          </p>

          <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Your Community, Our Service
          </h1>

          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
            Transparent, efficient government services at your fingertips.
            Connect with Barangay Pamplona Dos, access services easily, and be
            part of building a thriving community.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/services"
              className="rounded-full px-8 py-3.5 text-center font-semibold text-white transition hover:brightness-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
              style={{ backgroundColor: ORANGE }}
            >
              Explore services
            </Link>
            <Link
              href="/about"
              className="rounded-full border-2 border-white/70 px-8 py-3.5 text-center font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
