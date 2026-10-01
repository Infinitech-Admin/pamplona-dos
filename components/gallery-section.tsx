"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

export interface GalleryAlbum {
  folder: string;
  caption: string;
  images: string[]; // resolved image paths, in order
}

// Palette: deep green base, orange as a small accent (same as the other sections)
const GREEN = "#1F6B2E";
const GREEN_DARK = "#124A1F";
const ORANGE = "#F47B20";

const PAGE_SIZE = 6;

const ALBUM_CAPTIONS: Record<string, string> = {
  bmi: "Body Mass Index (BMI) Assessment & Nutrition Counseling",
  "emergency-preparedness": "Emergency Preparedness",
  meeting: "School-Barangay Coordination Meeting",
  "school-inspection": "Barangay Tanod School Inspection",
  "senior-citizen-opening": "Opening of Senior Citizens Office",
  "sayaw-kabataan-2026": "Sayaw Kabataan 2026",
};

const toTitleCase = (folder: string) =>
  folder.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

interface GallerySectionProps {
  title?: string;
  subtitle?: string;
}

export default function GallerySection({
  title = "Life in Our Barangay",
  subtitle = "A look at the people, programs, and moments that make our community",
}: GallerySectionProps) {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [activeAlbumIndex, setActiveAlbumIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/gallery");
        const data = await res.json();

        if (data.success && Array.isArray(data.albums)) {
          const withCaptions: GalleryAlbum[] = data.albums.map(
            (a: { folder: string; images: string[] }) => ({
              folder: a.folder,
              images: a.images,
              caption: ALBUM_CAPTIONS[a.folder] || toTitleCase(a.folder),
            }),
          );
          setAlbums(withCaptions);
        }
      } catch (error) {
        console.error("[GallerySection] Failed to load albums:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const openAlbum = (albumIndex: number) => {
    setActiveAlbumIndex(albumIndex);
    setActivePhotoIndex(0);
  };

  const closeAlbum = () => setActiveAlbumIndex(null);

  const activeAlbum =
    activeAlbumIndex !== null ? albums[activeAlbumIndex] : null;

  const showPrevPhoto = () => {
    if (!activeAlbum) return;
    setActivePhotoIndex(
      (i) => (i - 1 + activeAlbum.images.length) % activeAlbum.images.length,
    );
  };

  const showNextPhoto = () => {
    if (!activeAlbum) return;
    setActivePhotoIndex((i) => (i + 1) % activeAlbum.images.length);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!activeAlbum) return;
      if (e.key === "Escape") closeAlbum();
      if (e.key === "ArrowLeft") showPrevPhoto();
      if (e.key === "ArrowRight") showNextPhoto();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeAlbum, activeAlbumIndex]);

  useEffect(() => {
    document.body.style.overflow = activeAlbum ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeAlbum]);

  return (
    <section className="bg-[#F4F8F3] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: GREEN }}
            >
              <Images className="h-5 w-5" />
            </span>
            <span
              className="h-1 w-10 rounded-full"
              style={{ backgroundColor: ORANGE }}
            />
          </div>
          <h2
            className="mb-3 text-4xl font-bold tracking-tight md:text-5xl"
            style={{ color: GREEN_DARK }}
          >
            {title}
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">{subtitle}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-[#E4F1E4]"
              />
            ))}
          </div>
        ) : albums.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {albums.slice(0, visibleCount).map((album, i) => (
                <button
                  key={album.folder}
                  type="button"
                  onClick={() => openAlbum(i)}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-[#D5E5D4] bg-[#E4F1E4] text-left transition-colors hover:border-[#F47B20] focus:outline-none focus-visible:border-[#F47B20] focus-visible:ring-4 focus-visible:ring-[#F47B20]/25"
                >
                  <img
                    src={album.images[0]}
                    alt={album.caption}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark green fade at the bottom only, so the photo stays visible */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#124A1F]/90 via-[#124A1F]/10 to-transparent p-4">
                    <div>
                      <span className="block text-sm font-semibold leading-snug text-white sm:text-base">
                        {album.caption}
                      </span>
                      <span className="text-xs text-white/75">
                        {album.images.length} photo
                        {album.images.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {albums.length > visibleCount && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  className="rounded-full border-2 border-[#1F6B2E] px-8 py-3 font-semibold text-[#1F6B2E] transition-colors hover:bg-[#1F6B2E] hover:text-white"
                >
                  Show more ({albums.length - visibleCount} left)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#BCD6BB] bg-white py-16 text-center">
            <p className="text-gray-600">No photos available yet.</p>
          </div>
        )}
      </div>

      {/* Album dialog */}
      <AnimatePresence>
        {activeAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAlbum}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <button
              onClick={closeAlbum}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {activeAlbum.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrevPhoto();
                  }}
                  aria-label="Previous photo"
                  className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-8"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showNextPhoto();
                  }}
                  aria-label="Next photo"
                  className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-8"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            )}

            <motion.div
              key={`${activeAlbumIndex}-${activePhotoIndex}`}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[90vh] w-full max-w-4xl flex-col items-center"
            >
              <img
                src={activeAlbum.images[activePhotoIndex]}
                alt={`${activeAlbum.caption} photo ${activePhotoIndex + 1}`}
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain"
              />

              <div className="mt-5 text-center">
                <p className="text-lg font-semibold text-white">
                  {activeAlbum.caption}
                </p>
                <p className="mt-1 text-sm text-white/65">
                  {activePhotoIndex + 1} / {activeAlbum.images.length}
                </p>
                <span
                  className="mx-auto mt-3 block h-1 w-10 rounded-full"
                  style={{ backgroundColor: ORANGE }}
                />
              </div>

              {activeAlbum.images.length > 1 && (
                <div className="mt-5 flex max-w-full flex-wrap justify-center gap-2">
                  {activeAlbum.images.map((src, idx) => (
                    <button
                      key={src}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex(idx);
                      }}
                      aria-label={`Show photo ${idx + 1}`}
                      className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        idx === activePhotoIndex
                          ? "border-[#F47B20]"
                          : "border-white/25 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
