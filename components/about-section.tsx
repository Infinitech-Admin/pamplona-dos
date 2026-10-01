"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Home,
  MapPin,
  CalendarDays,
  X,
  ZoomIn,
  Check,
} from "lucide-react";

// Palette: deep green base, orange used sparingly (same as the other sections)
const GREEN = "#1F6B2E";
const GREEN_DARK = "#124A1F";
const ORANGE = "#F47B20";

// ---- Real data (update here when new figures come out) ----
// Population: PSA 2024 Census of Population (POPCEN) – 11,443
// Households: PSA 2015 Census – 2,727 (latest figure found)
// Land area & founding: Barangay Pamplona Dos official page – 112.16 ha, P.D. 1332 (April 3, 1978)
// Officials: Punong Barangay + 7 Kagawads + SK Chairperson + Secretary + Treasurer = 11 (per Local Government Code)
const POPULATION = "11,443";
const HOUSEHOLDS = "2,727";
const LAND_AREA = "112.16 ha";
const FOUNDED = "1978";

export default function AboutSection() {
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsImageModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = isImageModalOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isImageModalOpen]);

  const stats = [
    { icon: Users, number: POPULATION, label: "Residents (2024 Census)" },
    { icon: Home, number: HOUSEHOLDS, label: "Households (2015 Census)" },
    { icon: MapPin, number: LAND_AREA, label: "Total Land Area" },
    {
      icon: CalendarDays,
      number: FOUNDED,
      label: "Year Established (P.D. 1332)",
    },
  ];

  const highlights = [
    "Delivering efficient and responsive barangay services",
    "Fostering unity through community activities",
    "Promoting peace, order, and public safety",
    "Supporting residents through barangay programs and assistance",
  ];

  const teamStats = [
    { number: "11", label: "Barangay Officials" },
    { number: "7", label: "Barangay Kagawads" },
    { number: "1", label: "Punong Barangay" },
  ];

  return (
    <section id="about" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          {/* Text */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: GREEN }}
              >
                <Home className="h-5 w-5" />
              </span>
              <span
                className="h-1 w-10 rounded-full"
                style={{ backgroundColor: ORANGE }}
              />
            </div>

            <h2
              className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl"
              style={{ color: GREEN_DARK }}
            >
              Barangay Pamplona Dos
            </h2>

            <p className="mb-5 text-lg leading-relaxed text-gray-700">
              Barangay Pamplona Dos is one of the 20 barangays of Las Piñas
              City, National Capital Region. Created by Presidential Decree No.
              1332 on April 3, 1978, it covers {LAND_AREA.replace(" ha", "")}{" "}
              hectares and is home to {POPULATION} residents based on the 2024
              Census of Population.
            </p>

            <p className="mb-7 text-lg leading-relaxed text-gray-700">
              Our barangay is more than just a place—it’s a home where families
              grow and every voice matters. We take pride in:
            </p>

            <ul className="space-y-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FDEBDB] text-[#F47B20]">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span className="text-lg text-gray-800">{item}</span>
                </li>
              ))}
            </ul>

            <button
              className="mt-9 rounded-full px-8 py-3.5 font-semibold text-white transition hover:brightness-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F47B20]/40"
              style={{ backgroundColor: ORANGE }}
            >
              Learn more about us
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`rounded-2xl p-7 ${
                    i === 0
                      ? "text-white"
                      : "border border-[#D5E5D4] border-t-4 border-t-[#F47B20] bg-[#F4F8F3]"
                  }`}
                  style={i === 0 ? { backgroundColor: GREEN_DARK } : undefined}
                >
                  <Icon className="mb-6 h-7 w-7 text-[#F47B20]" />
                  <div
                    className={`mb-1 text-4xl font-bold ${
                      i === 0 ? "text-white" : "text-[#124A1F]"
                    }`}
                  >
                    {stat.number}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      i === 0 ? "text-white/80" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div className="mt-24">
          <div className="mb-10 max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="h-6 w-1 rounded-full"
                style={{ backgroundColor: ORANGE }}
              />
              <h3
                className="text-3xl font-bold tracking-tight md:text-4xl"
                style={{ color: GREEN_DARK }}
              >
                The People Behind Our Community
              </h3>
            </div>
            <p className="text-lg text-gray-600">
              Your elected officials, led by Punong Barangay Roberto D.H.
              Villalon, serving Barangay Pamplona Dos.
            </p>
          </div>

          <button
            onClick={() => setIsImageModalOpen(true)}
            aria-label="View team photo full screen"
            className="group relative block w-full overflow-hidden rounded-3xl text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F47B20]/50"
          >
            <div className="aspect-[4/3] sm:aspect-[21/9] bg-[#E4F1E4]">
              <img
                src="/our-team2.jpg"
                alt="Barangay Pamplona Dos Officials"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Caption */}
            <div
              className="absolute inset-x-0 bottom-0 px-6 py-5 sm:px-8"
              style={{
                background:
                  "linear-gradient(to top, rgba(18,74,31,0.92), rgba(18,74,31,0))",
              }}
            >
              <h4 className="text-xl font-bold text-white sm:text-2xl">
                Barangay Officials 2023–2026
              </h4>
              <p className="text-white/85">
                Together, building a stronger community for all
              </p>
            </div>

            {/* Zoom hint */}
            <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#124A1F] opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <ZoomIn className="h-5 w-5" />
            </span>
          </button>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {teamStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[#D5E5D4] border-t-4 border-t-[#F47B20] bg-[#F4F8F3] p-6 text-center"
              >
                <div className="mb-1 text-3xl font-bold text-[#124A1F]">
                  {s.number}
                </div>
                <div className="font-medium text-gray-700">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full screen image modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <button
              aria-label="Close"
              className="absolute right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-h-[92vh] w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/our-team2.jpg"
                alt="Barangay Pamplona Dos Officials - Full View"
                className="max-h-[74vh] w-full rounded-2xl object-contain"
              />
              <div className="mt-5 text-center">
                <h4 className="mb-1 text-xl font-bold text-white sm:text-2xl">
                  Barangay Officials 2023–2026
                </h4>
                <p className="text-white/75">
                  Together, building a stronger community for all
                </p>
                <span
                  className="mx-auto mt-3 block h-1 w-10 rounded-full"
                  style={{ backgroundColor: ORANGE }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
