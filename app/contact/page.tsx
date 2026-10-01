"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import PageLayout from "@/components/page-layout";
import Link from "next/link";
import { useState } from "react";

// Palette: deep green base, orange as accent (same as the other sections)
const GREEN = "#1F6B2E";
const GREEN_DARK = "#124A1F";
const ORANGE = "#F47B20";

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-4 disabled:bg-gray-50 disabled:opacity-70";
const inputOk =
  "border-gray-300 focus:border-[#1F6B2E] focus:ring-[#1F6B2E]/15";
const inputErr = "border-red-500 focus:border-red-500 focus:ring-red-500/15";

// Barangay Pamplona Dos Hall – Aquarius St., Pamplona Park Subd., Las Piñas City
const HALL_LAT = 14.4495828;
const HALL_LNG = 120.9748902;

function MapEmbed() {
  return (
    <div className="h-[420px] w-full">
      <iframe
        title="Barangay Pamplona Dos location map"
        src={`https://www.google.com/maps?q=${HALL_LAT},${HALL_LNG}&z=17&output=embed`}
        className="h-full w-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

const contactItems = [
  {
    icon: MapPin,
    title: "Office Location",
    details:
      "Barangay Hall, Aquarius St., Pamplona Park Subd., Pamplona Dos, Las Piñas City",
    link: `https://www.google.com/maps/search/?api=1&query=${HALL_LAT},${HALL_LNG}`,
    isExternal: true,
  },
  {
    icon: Phone,
    title: "Phone",
    details: "(02) 8874-6224",
    link: "tel:+63288746224",
    isExternal: false,
  },
  {
    icon: Mail,
    title: "Email",
    details: "pamplonados.lp@gmail.com",
    link: "mailto:pamplonados.lp@gmail.com",
    isExternal: false,
  },
  {
    icon: Clock,
    title: "Office Hours",
    // TODO: confirm actual hours with the barangay hall
    details: "Monday - Friday: 8:00 AM - 5:00 PM",
    link: null,
    isExternal: false,
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    setErrors({});

    // Validation
    const newErrors: { name?: string; email?: string } = {};

    // Name validation - no numbers allowed
    if (/\d/.test(formData.name)) {
      newErrors.name = "Name cannot contain numbers";
    }

    // Email validation
    if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: data.message || "Message sent successfully!",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    }
  };

  return (
    <PageLayout
      title="Contact Us"
      subtitle="Get in touch with Barangay Pamplona Dos"
      image="/newspaper-journalism-city-news.jpg"
    >
      <section className="bg-[#F4F8F3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Contact form */}
            <div className="rounded-3xl border border-[#D5E5D4] bg-white p-8 md:p-10 lg:col-span-3">
              <div className="mb-6 flex items-center gap-3">
                <span
                  className="h-7 w-1 rounded-full"
                  style={{ backgroundColor: ORANGE }}
                />
                <h2
                  className="text-2xl font-bold md:text-3xl"
                  style={{ color: GREEN_DARK }}
                >
                  Send us a message
                </h2>
              </div>

              {submitStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  className={`mb-6 flex items-center gap-3 rounded-xl p-4 ${
                    submitStatus.type === "success"
                      ? "border border-[#BCD6BB] bg-[#E4F1E4] text-[#124A1F]"
                      : "border border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium">{submitStatus.message}</p>
                </motion.div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      Full name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Block numbers from being typed
                        if (!/\d/.test(value)) {
                          setFormData({ ...formData, name: value });
                          if (errors.name)
                            setErrors({ ...errors, name: undefined });
                        }
                      }}
                      onBlur={() => {
                        if (formData.name && /\d/.test(formData.name)) {
                          setErrors({
                            ...errors,
                            name: "Name cannot contain numbers",
                          });
                        }
                      }}
                      className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                      placeholder="Your name"
                      required
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email)
                          setErrors({ ...errors, email: undefined });
                      }}
                      onBlur={() => {
                        if (
                          formData.email &&
                          !EMAIL_REGEX.test(formData.email)
                        ) {
                          setErrors({
                            ...errors,
                            email: "Please enter a valid email address",
                          });
                        }
                      }}
                      className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className={`${inputBase} ${inputOk}`}
                    placeholder="How can we help?"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`${inputBase} ${inputOk} resize-y`}
                    placeholder="Your message..."
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold text-white transition hover:brightness-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#F47B20]/40 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundColor: ORANGE }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    "Send message"
                  )}
                </button>
              </form>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-[#D5E5D4] bg-white p-6"
                  >
                    <span
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: GREEN }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="mb-1 font-bold text-gray-900">
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          target={item.isExternal ? "_blank" : undefined}
                          rel={
                            item.isExternal ? "noopener noreferrer" : undefined
                          }
                          className="break-words text-sm font-medium text-[#1F6B2E] underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
                        >
                          {item.details}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-600">{item.details}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-3xl border border-[#D5E5D4] bg-white">
            <MapEmbed />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-4xl rounded-3xl px-8 py-14 text-center text-white md:px-14"
          style={{ backgroundColor: GREEN_DARK }}
        >
          <span
            className="mx-auto mb-6 block h-1 w-12 rounded-full"
            style={{ backgroundColor: ORANGE }}
          />
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Access barangay services easily
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/85">
            Request documents, track applications, and stay updated with
            barangay services in one place.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="rounded-full px-8 py-3 font-semibold text-white transition hover:brightness-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
              style={{ backgroundColor: ORANGE }}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full border-2 border-white/70 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              Register
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
