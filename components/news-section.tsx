"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Newspaper,
  Loader2,
  ChevronRight,
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

// Palette: deep green base, orange used sparingly (same as AnnouncementsSection)
const GREEN = "#1F6B2E";
const GREEN_DARK = "#124A1F";
const ORANGE = "#F47B20";

const PAGE_SIZE = 6;

export default function NewsSection() {
  const [news, setNews] = React.useState<NewsArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] =
    React.useState<NewsArticle | null>(null);
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  // Get image URL - handle relative paths from Laravel
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:8000";
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;
    return `${baseUrl}/${cleanPath}`;
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/placeholder.svg";
  };

  const fetchNews = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/news/published?per_page=12");
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
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedArticle(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = selectedArticle ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedArticle]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const categories = [
    "All",
    ...Array.from(new Set(news.map((n) => n.category))),
  ];
  const filtered =
    activeCategory === "All"
      ? news
      : news.filter((n) => n.category === activeCategory);
  const [featured, ...rest] = filtered;
  const visibleRest = rest.slice(0, visibleCount);

  return (
    <>
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: GREEN }}
              >
                <Newspaper className="h-5 w-5" />
              </span>
              <span
                className="h-1 w-10 rounded-full"
                style={{ backgroundColor: ORANGE }}
              />
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
              style={{ color: GREEN_DARK }}
            >
              Barangay News
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Stories and updates from around Barangay Pamplona Dos.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-600">
              <Loader2
                className="h-8 w-8 animate-spin mb-3"
                style={{ color: GREEN }}
              />
              <p className="font-medium">Loading news…</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="rounded-2xl border border-[#CFE3CF] bg-[#F4F8F3] p-10 text-center">
              <p className="mb-5 font-semibold text-gray-800">
                Failed to load news: {error}
              </p>
              <button
                onClick={fetchNews}
                className="rounded-full px-6 py-3 font-semibold text-white transition-colors hover:bg-[#124A1F]"
                style={{ backgroundColor: GREEN }}
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && news.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#BCD6BB] bg-[#F4F8F3] py-20 text-center">
              <span
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: GREEN }}
              >
                <Newspaper className="h-7 w-7" />
              </span>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: GREEN_DARK }}
              >
                No news yet
              </h3>
              <p className="text-gray-600">New stories will appear here.</p>
            </div>
          )}

          {/* Content */}
          {!loading && !error && featured && (
            <>
              {/* Category filter */}
              {categories.length > 2 && (
                <div className="mb-8 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setActiveCategory(c);
                        setVisibleCount(PAGE_SIZE);
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        activeCategory === c
                          ? "bg-[#1F6B2E] text-white"
                          : "bg-white text-gray-700 border border-[#D5E5D4] hover:border-[#1F6B2E]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {/* Featured story */}
              <button
                onClick={() => setSelectedArticle(featured)}
                className="group mb-10 grid w-full overflow-hidden rounded-3xl text-left text-white md:grid-cols-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F47B20]/50"
                style={{ backgroundColor: GREEN_DARK }}
              >
                <div className="h-64 md:h-full md:min-h-[340px] bg-[#E4F1E4] overflow-hidden">
                  <img
                    src={getImageUrl(featured.image)}
                    alt={featured.title}
                    onError={handleImgError}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-between p-8 md:p-10">
                  <div>
                    <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold mb-5">
                      {featured.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4 line-clamp-3">
                      {featured.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed line-clamp-4">
                      {featured.content}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between text-sm text-white/80">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(featured.published_at || featured.created_at)}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-white">
                      Read story
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </button>

              {/* Other stories */}
              {rest.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleRest.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[#D5E5D4] bg-white text-left transition-colors hover:border-[#1F6B2E] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1F6B2E]/20"
                    >
                      <div className="h-48 overflow-hidden bg-[#E4F1E4]">
                        <img
                          src={getImageUrl(article.image)}
                          alt={article.title}
                          onError={handleImgError}
                          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="rounded-full bg-[#E4F1E4] px-2.5 py-0.5 text-xs font-semibold text-[#1F6B2E]">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(
                              article.published_at || article.created_at,
                            )}
                          </span>
                        </div>
                        <h3 className="mb-2 text-lg font-bold leading-snug text-gray-900 line-clamp-2 group-hover:text-[#1F6B2E]">
                          {article.title}
                        </h3>
                        <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
                          {article.content}
                        </p>
                        <span
                          className="mt-auto inline-flex items-center gap-1 text-sm font-semibold"
                          style={{ color: GREEN }}
                        >
                          Read story
                          <ChevronRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            style={{ color: ORANGE }}
                          />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Show more */}
              {rest.length > visibleCount && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                    className="rounded-full border-2 border-[#1F6B2E] px-8 py-3 font-semibold text-[#1F6B2E] transition-colors hover:bg-[#1F6B2E] hover:text-white"
                  >
                    Show more ({rest.length - visibleCount} left)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal */}
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
              {/* Close */}
              <div
                className="flex items-center justify-between px-6 py-4 text-white"
                style={{ backgroundColor: GREEN_DARK }}
              >
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  {selectedArticle.category}
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  aria-label="Close"
                  className="rounded-full p-2 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto">
                {selectedArticle.image && (
                  <div className="flex justify-center bg-[#F4F8F3] p-5">
                    <img
                      src={getImageUrl(selectedArticle.image)}
                      alt={selectedArticle.title}
                      onError={handleImgError}
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
                    <span
                      className="h-1 w-8 rounded-full"
                      style={{ backgroundColor: ORANGE }}
                    />
                  </div>

                  <p className="whitespace-pre-line text-lg leading-relaxed text-gray-800">
                    {selectedArticle.content}
                  </p>
                </div>
              </div>

              {/* Footer */}
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
    </>
  );
}
