"use client";

import { motion } from "framer-motion";

interface PageHeroBannerProps {
  title: string;
  subtitle: string;
  image: string;
}

// Palette: deep green base, orange as a small accent (same as the other sections)
const ORANGE = "#F47B20";

export default function PageHeroBanner({
  title,
  subtitle,
  image,
}: PageHeroBannerProps) {
  return (
    <header className="relative h-72 w-full overflow-hidden md:h-96">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {/* Green overlay: solid on the text side, lighter toward the right so the photo still shows */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(18,74,31,0.95) 0%, rgba(18,74,31,0.85) 45%, rgba(18,74,31,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <span
            className="mb-5 block h-1 w-12 rounded-full"
            style={{ backgroundColor: ORANGE }}
          />
          <h1 className="mb-4 text-balance text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl text-balance text-lg leading-relaxed text-white/85 md:text-xl">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </header>
  );
}
