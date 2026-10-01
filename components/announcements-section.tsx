"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, Loader2, X, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Announcement {
  id: number;
  title: string;
  date: string;
  category: "Update" | "Event" | "Alert" | "Development" | "Health" | "Notice";
  description: string;
  content: string;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

// Palette: deep green base, tinted greens for surfaces, orange used sparingly.
const GREEN = "#1F6B2E"; // primary
const GREEN_DARK = "#124A1F"; // headers / panels
const ORANGE = "#F47B20"; // accent only

// Only "Alert" gets the orange tag; everything else stays green.
const categoryStyle = (category: string) =>
  category === "Alert"
    ? "bg-[#F47B20] text-white"
    : "bg-[#E4F1E4] text-[#1F6B2E]";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function AnnouncementsSection() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [selected, setSelected] = useState<Announcement | null>(null);
  const PAGE_SIZE = 5;
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/announcements`,
      );
      const data = await response.json();

      if (data.success && data.data) {
        setAnnouncements(data.data.data || []);
      } else {
        setError("Failed to load announcements");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load announcements.",
        });
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to load announcements");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load announcements. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    setSubscribing(true);

    try {
      const subscribeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscribers/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const subscribeData = await subscribeResponse.json();

      if (!subscribeData.success) {
        toast({
          variant: "destructive",
          title: "Subscription Failed",
          description:
            subscribeData.message || "Failed to subscribe. Please try again.",
        });
        setSubscribing(false);
        return;
      }

      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          type: "verification",
          data: {
            email: email,
            verifyUrl: `${window.location.origin}/verify-subscription?token=${subscribeData.data.token}`,
          },
        }),
      });

      const emailData = await emailResponse.json();

      if (emailData.success) {
        setEmail("");
        toast({
          title: "Successfully Subscribed!",
          description: "Please check your email to verify your subscription.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Email Verification Issue",
          description:
            "Subscribed, but failed to send verification email. Please contact support.",
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        variant: "destructive",
        title: "Subscription Error",
        description: "Failed to subscribe. Please try again later.",
      });
    } finally {
      setSubscribing(false);
    }
  };

  const categories = [
    "All",
    ...Array.from(new Set(announcements.map((a) => a.category))),
  ];
  const filtered =
    activeCategory === "All"
      ? announcements
      : announcements.filter((a) => a.category === activeCategory);
  const [featured, ...rest] = filtered;
  const visibleRest = rest.slice(0, visibleCount);

  return (
    <section className="bg-[#F4F8F3] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: GREEN }}
            >
              <Bell className="h-5 w-5" />
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
            Community Announcements
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            The latest news, events, and notices from Barangay Pamplona Dos.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <Loader2
              className="h-8 w-8 animate-spin mb-3"
              style={{ color: GREEN }}
            />
            <p className="font-medium">Loading announcements…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-2xl border border-[#CFE3CF] bg-white p-10 text-center">
            <p className="mb-5 font-semibold text-gray-800">{error}</p>
            <button
              onClick={fetchAnnouncements}
              className="rounded-full px-6 py-3 font-semibold text-white transition-colors hover:bg-[#124A1F]"
              style={{ backgroundColor: GREEN }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && announcements.length > 0 && (
          <>
            {/* Category filter */}
            {categories.length > 2 && (
              <div className="mb-6 flex flex-wrap gap-2">
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

            <div className="grid gap-6 lg:grid-cols-5 mb-16">
              {/* Featured (latest) */}
              <button
                onClick={() => setSelected(featured)}
                className="lg:col-span-3 text-left rounded-3xl p-8 md:p-10 text-white flex flex-col justify-between min-h-[320px] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F47B20]/50"
                style={{ backgroundColor: GREEN_DARK }}
              >
                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-6 ${
                      featured.category === "Alert"
                        ? "bg-[#F47B20] text-white"
                        : "bg-white/15 text-white"
                    }`}
                  >
                    {featured.category}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold leading-tight mb-4 line-clamp-3">
                    {featured.title}
                  </h3>
                  <p className="text-white/80 text-base md:text-lg leading-relaxed line-clamp-3 max-w-xl">
                    {featured.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-8 text-sm text-white/80">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(featured.date)}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-white">
                    Read more
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </button>

              {/* Rest as a list */}
              <div className="lg:col-span-2 flex flex-col rounded-3xl border border-[#D5E5D4] bg-white overflow-hidden">
                <div className="flex-1 overflow-y-auto max-h-[440px] lg:max-h-[460px]">
                  {rest.length === 0 && (
                    <p className="p-8 text-gray-500">No other announcements.</p>
                  )}
                  {visibleRest.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className="group flex items-start gap-4 px-6 py-5 text-left border-b border-[#E6EFE5] last:border-b-0 transition-colors hover:bg-[#F4F8F3] focus:outline-none focus-visible:bg-[#F4F8F3]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryStyle(a.category)}`}
                          >
                            {a.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(a.date)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#1F6B2E]">
                          {a.title}
                        </h4>
                      </div>
                      <ChevronRight className="h-5 w-5 mt-1 flex-shrink-0 text-gray-300 group-hover:text-[#1F6B2E]" />
                    </button>
                  ))}
                </div>
                {rest.length > visibleCount && (
                  <button
                    onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                    className="shrink-0 w-full border-t border-[#E6EFE5] px-6 py-4 text-sm font-semibold text-[#1F6B2E] hover:bg-[#F4F8F3]"
                  >
                    Show more ({rest.length - visibleCount} left)
                  </button>
                )}
              </div>
            </div>

            {/* Subscribe */}
            <div className="rounded-3xl border border-[#D5E5D4] bg-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="max-w-md">
                <h3
                  className="text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: GREEN_DARK }}
                >
                  Get announcements by email
                </h3>
                <p className="text-gray-600">
                  We'll send new announcements straight to your inbox.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="Your email address"
                  aria-label="Email address"
                  className="flex-1 rounded-full border border-gray-300 bg-white px-5 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1F6B2E] focus:ring-4 focus:ring-[#1F6B2E]/15"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 font-semibold text-white transition-colors hover:brightness-95 disabled:opacity-60 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F47B20]/40"
                  style={{ backgroundColor: ORANGE }}
                >
                  {subscribing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Subscribing…
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty */}
        {!loading && !error && announcements.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#BCD6BB] bg-white py-20 text-center">
            <span
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: GREEN }}
            >
              <Bell className="h-7 w-7" />
            </span>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: GREEN_DARK }}
            >
              No announcements yet
            </h3>
            <p className="text-gray-600">
              New community updates will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
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
              {/* Header */}
              <div
                className="flex items-start justify-between gap-4 px-8 py-6 text-white"
                style={{ backgroundColor: GREEN_DARK }}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        selected.category === "Alert"
                          ? "bg-[#F47B20] text-white"
                          : "bg-white/15 text-white"
                      }`}
                    >
                      {selected.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-white/75">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selected.date)}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                    {selected.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="flex-shrink-0 rounded-full p-2 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-8 py-7">
                <p className="mb-6 text-lg leading-relaxed text-gray-700">
                  {selected.description}
                </p>
                <div
                  className="rounded-2xl bg-[#F4F8F3] p-6 border-l-4"
                  style={{ borderColor: ORANGE }}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-900">
                    {selected.content}
                  </p>
                </div>
                <p className="mt-6 text-xs text-gray-400">
                  Reference ID: #{selected.id}
                </p>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-8 py-5">
                <button
                  onClick={() => setSelected(null)}
                  className="w-full sm:w-auto rounded-full px-8 py-3 font-semibold text-white transition-colors hover:bg-[#124A1F]"
                  style={{ backgroundColor: GREEN }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
