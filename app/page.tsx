"use client";

import { useEffect, useState, useRef } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ServicesSection from "@/components/services-section";
import GallerySection from "@/components/gallery-section";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Users,
  Zap,
  Clock,
  X,
  Calendar,
  User,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  MapPin,
} from "lucide-react";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  image?: string;
  status: string;
  published_at?: string;
  created_at: string;
  author?: {
    id: number;
    name: string;
    email: string;
  };
}

// Palette: deep green base, orange as a small accent (same as the other sections)
const GREEN = "#1F6B2E";
const GREEN_DARK = "#124A1F";
const ORANGE = "#F47B20";

// Hero background videos, served from /public/videos/.
// The carousel auto-advances when a clip ends; the dots let people jump.
const heroVideos = ["/videos/hero-1.mp4"];

const heroText = "Welcome to Pamplona Dos";
const TYPE_SPEED_MS = 65; // per character
const HOLD_MS = 1400; // how long the finished text stays before fading

export default function Home() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [introVisible, setIntroVisible] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Video must start muted for autoplay; the person can tap to unmute.
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVideoEnd = () => {
    // Don't yank the person to the next clip while they watch fullscreen.
    if (isFullscreen) return;
    setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
  };

  const toggleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (!document.fullscreenElement) {
        // iOS Safari only supports native fullscreen on the <video> itself.
        if ((video as any).webkitEnterFullscreen) {
          (video as any).webkitEnterFullscreen();
        } else if (video.requestFullscreen) {
          await video.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen request failed:", err);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Typewriter intro: types once, holds briefly, then fades out for good.
  useEffect(() => {
    let charIndex = 0;
    let holdTimeout: ReturnType<typeof setTimeout> | undefined;

    const typingInterval = setInterval(() => {
      charIndex += 1;
      setTypedText(heroText.slice(0, charIndex));

      if (charIndex >= heroText.length) {
        clearInterval(typingInterval);
        holdTimeout = setTimeout(() => setIntroVisible(false), HOLD_MS);
      }
    }, TYPE_SPEED_MS);

    return () => {
      clearInterval(typingInterval);
      if (holdTimeout) clearTimeout(holdTimeout);
    };
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/news/published?per_page=20");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          let newsData: NewsArticle[] = [];

          if (result.data && typeof result.data === "object") {
            if (Array.isArray(result.data.data)) {
              newsData = result.data.data;
            } else if (Array.isArray(result.data)) {
              newsData = result.data;
            }
          }

          setNews(newsData);
        } else {
          throw new Error(result.message || "Failed to fetch news");
        }
      } catch (error) {
        console.error("[Home] Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedArticle(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedArticle ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedArticle]);

  const stats = [
    { label: "Community Members", value: "18,500+", icon: Users },
    { label: "Services Offered", value: "14+", icon: Zap },
    { label: "Requests Processed", value: "500+", icon: Clock },
  ];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      announcement: "Announcement",
      event: "Event",
      alert: "Alert",
      update: "Update",
      news: "News",
    };
    return categoryMap[category?.toLowerCase()] || "Update";
  };

  const getImageUrl = (image: string) =>
    `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}/${image}`;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero: full-bleed video carousel.
          The base color is dark green (not black), so while the video is
          still loading you see the site's color instead of a flat flash. */}
      <section
        className="relative aspect-video max-h-[92svh] w-full overflow-hidden sm:max-h-[85svh] lg:aspect-auto lg:h-screen lg:max-h-none"
        style={{ backgroundColor: GREEN_DARK }}
      >
        {/* Blurred fill layer for tall mobile screens */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            key={`bg-${currentVideoIndex}`}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
          >
            <source src={heroVideos[currentVideoIndex]} type="video/mp4" />
          </video>
        </div>

        {/* Foreground video */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.video
              key={currentVideoIndex}
              ref={videoRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={handleVideoEnd}
              className="relative h-full w-full object-contain lg:object-cover"
            >
              <source src={heroVideos[currentVideoIndex]} type="video/mp4" />
            </motion.video>
          </AnimatePresence>
        </div>

        {/* Typewriter intro: white text on a dark green tint so it is always
            readable. Fades out for good so the video is left unobstructed. */}
        <AnimatePresence>
          {introVisible && (
            <motion.div
              key="hero-intro"
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 z-10"
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(18,74,31,0.55), rgba(18,74,31,0.25) 50%, rgba(18,74,31,0.6))",
                }}
              />

              <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
                <h1
                  className="max-w-[90vw] break-words text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    textShadow: "0 2px 12px rgba(0,0,0,0.45)",
                  }}
                >
                  {typedText}
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] animate-pulse rounded-full bg-white"
                  />
                </h1>

                <motion.span
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={
                    typedText.length === heroText.length
                      ? { scaleX: 1, opacity: 1 }
                      : { scaleX: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="mt-5 block h-1 w-24 origin-center rounded-full sm:w-32"
                  style={{ backgroundColor: ORANGE }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound + fullscreen */}
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="flex items-center justify-center rounded-full border border-white/25 bg-black/40 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:p-3"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Watch fullscreen"}
            className="flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-4 sm:py-2.5 sm:text-sm"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            </span>
          </button>
        </div>

        {/* Carousel dots */}
        {heroVideos.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-3 sm:bottom-10">
            {heroVideos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentVideoIndex(i)}
                aria-label={`Show background clip ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === currentVideoIndex
                    ? "w-8"
                    : "w-3 bg-white/40 hover:bg-white/70"
                }`}
                style={
                  i === currentVideoIndex
                    ? { backgroundColor: ORANGE }
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Welcome */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-[#E4F1E4]">
                <img
                  src="/images/meeting/1.jpg"
                  alt="Barangay Pamplona Dos"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 right-4 flex items-center gap-3 rounded-2xl border border-[#D5E5D4] bg-white px-5 py-4 shadow-lg sm:-right-4">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: GREEN }}
                >
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Las Piñas City
                  </p>
                  <p className="text-xs text-gray-500">4th District, NCR</p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <span
                className="mb-5 block h-1 w-12 rounded-full"
                style={{ backgroundColor: ORANGE }}
              />
              <p className="mb-3 font-semibold text-[#1F6B2E]">
                Barangay Pamplona Dos
              </p>
              <h2
                className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl"
                style={{ color: GREEN_DARK }}
              >
                Serving Our Community, Building a Better Tomorrow
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-700">
                Nestled in the vibrant City of Las Piñas, Barangay Pamplona Dos
                is a thriving community where tradition, service, and progress
                come together. Home to thousands of residents, our barangay is
                committed to creating a safe, inclusive, and welcoming
                environment where families, businesses, and future generations
                can thrive. Guided by transparency, unity, and public service,
                we continue to strengthen our community through responsive
                governance, meaningful programs, and initiatives that improve
                the quality of life for every resident.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white transition hover:brightness-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F47B20]/40"
                style={{ backgroundColor: ORANGE }}
              >
                Learn more about us
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services (shared component) */}
      <ServicesSection />

      {/* Stats */}
      <section
        className="px-4 py-16 sm:px-6 lg:px-8"
        style={{ backgroundColor: GREEN_DARK }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 text-white md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-5">
                <Icon className="h-9 w-9 flex-shrink-0 text-[#F47B20]" />
                <div>
                  <div className="text-4xl font-bold">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gallery */}
      <GallerySection />

      {/* Latest news */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span
                className="mb-5 block h-1 w-12 rounded-full"
                style={{ backgroundColor: ORANGE }}
              />
              <h2
                className="mb-3 text-4xl font-bold tracking-tight md:text-5xl"
                style={{ color: GREEN_DARK }}
              >
                Latest Updates
              </h2>
              <p className="text-lg text-gray-600">
                Recent news and announcements from our barangay.
              </p>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 font-semibold text-[#1F6B2E] hover:underline"
            >
              View all news
              <ArrowRight className="h-5 w-5" style={{ color: ORANGE }} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-2xl bg-[#E4F1E4]"
                />
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedArticle(item)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#D5E5D4] bg-white text-left transition-colors hover:border-[#F47B20] focus:outline-none focus-visible:border-[#F47B20] focus-visible:ring-4 focus-visible:ring-[#F47B20]/20"
                >
                  <div className="h-52 overflow-hidden bg-[#E4F1E4]">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-5xl">
                        📰
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-[#E4F1E4] px-2.5 py-0.5 text-xs font-semibold text-[#1F6B2E]">
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(item.published_at || item.created_at)}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold leading-snug text-gray-900 line-clamp-2 group-hover:text-[#1F6B2E]">
                      {item.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
                      {item.content}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[#1F6B2E]">
                      Read more
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        style={{ color: ORANGE }}
                      />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#BCD6BB] bg-[#F4F8F3] py-16 text-center">
              <p className="text-gray-600">No news available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Article modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div
                className="flex items-center justify-between px-6 py-4 text-white"
                style={{ backgroundColor: GREEN_DARK }}
              >
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  {getCategoryLabel(selectedArticle.category)}
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  aria-label="Close"
                  className="rounded-full p-2 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {selectedArticle.image && (
                  <div className="flex justify-center bg-[#F4F8F3] p-5">
                    <img
                      src={getImageUrl(selectedArticle.image)}
                      alt={selectedArticle.title}
                      className="h-auto max-h-[420px] w-auto max-w-full rounded-xl object-contain"
                    />
                  </div>
                )}

                <div className="px-8 py-7 md:px-10">
                  <h2
                    className="mb-4 text-3xl font-bold leading-tight"
                    style={{ color: GREEN_DARK }}
                  >
                    {selectedArticle.title}
                  </h2>

                  <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-gray-200 pb-5 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" style={{ color: GREEN }} />
                      {formatDate(
                        selectedArticle.published_at ||
                          selectedArticle.created_at,
                      )}
                    </span>
                    {selectedArticle.author && (
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4" style={{ color: GREEN }} />
                        By {selectedArticle.author.name}
                      </span>
                    )}
                  </div>

                  <p className="whitespace-pre-line text-lg leading-relaxed text-gray-800">
                    {selectedArticle.content}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 px-8 py-5 md:px-10">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-full rounded-full px-8 py-3 font-semibold text-white transition-colors hover:bg-[#124A1F] sm:w-auto"
                  style={{ backgroundColor: GREEN }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="bg-white px-4 pb-24 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-4xl rounded-3xl px-8 py-14 text-center text-white md:px-14"
          style={{ backgroundColor: GREEN_DARK }}
        >
          <span
            className="mx-auto mb-6 block h-1 w-12 rounded-full"
            style={{ backgroundColor: ORANGE }}
          />
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/85">
            Join thousands of residents using our platform to access services
            and stay connected with our community.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-full px-8 py-3 font-semibold text-white transition hover:brightness-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
              style={{ backgroundColor: ORANGE }}
            >
              Sign up today
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-white/70 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
