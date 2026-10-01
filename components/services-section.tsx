"use client";

import {
  Search,
  FileText,
  Building,
  Users,
  TrendingUp,
  Heart,
  MapPin,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Palette: deep green base, orange used sparingly (same as the other sections)
const GREEN = "#1F6B2E";
const GREEN_DARK = "#124A1F";
const ORANGE = "#F47B20";

const guides = [
  // --- Public Safety ---
  {
    id: 14,
    icon: AlertTriangle,
    name: "Report an Issue",
    description: "Report road damage, garbage, flooding, and other city issues",
    category: "Public Safety",
    route: "/dashboard/citizen/report-issue",
  },
  {
    id: 1,
    icon: FileText,
    name: "Barangay Clearance",
    description: "Get barangay clearance",
    category: "Public Safety",
    route: "/dashboard/citizen/services/barangay-clearance",
  },
  {
    id: 8,
    icon: Users,
    name: "Police Clearance",
    description: "Request police clearance",
    category: "Public Safety",
    route: "/dashboard/citizen/services/police-clearance",
  },
  {
    id: 9,
    icon: MapPin,
    name: "Fire Safety Inspection",
    description: "Schedule inspection",
    category: "Public Safety",
    route: "/dashboard/citizen/services/fire-safety-inspection",
  },
  {
    id: 13,
    icon: MapPin,
    name: "Barangay Blotter",
    description: "Report and record incidents",
    category: "Public Safety",
    route: "/dashboard/citizen/services/barangay-blotter",
  },

  // --- Government Services ---
  {
    id: 2,
    icon: Building,
    name: "Business Permit Application",
    description: "Step-by-step guide to apply for a business permit.",
    category: "Government Services",
    route: "/dashboard/citizen/services/business-permit",
  },
  {
    id: 3,
    icon: Building,
    name: "Building Permit Process",
    description: "Requirements and procedures for obtaining a building permit.",
    category: "Government Services",
    route: "/dashboard/citizen/services/building-permit",
  },
  {
    id: 4,
    icon: FileText,
    name: "Community Tax Certificate",
    description: "How to get your Cedula (Community Tax Certificate).",
    category: "Government Services",
    route: "/dashboard/citizen/services/cedula",
  },
  {
    id: 5,
    icon: Heart,
    name: "Marriage License",
    description: "Apply for marriage license",
    category: "Government Services",
    route: "/dashboard/citizen/services/marriage-license",
  },
  {
    id: 11,
    icon: Users,
    name: "Residency Certificate",
    description: "Proof of residency certification",
    category: "Government Services",
    route: "/dashboard/citizen/services/residency-certificate",
  },
  {
    id: 12,
    icon: TrendingUp,
    name: "Good Moral Certificate",
    description: "Certificate of good moral character",
    category: "Government Services",
    route: "/dashboard/citizen/services/good-moral-certificate",
  },
  {
    id: 10,
    icon: FileText,
    name: "Certificate of Indigency",
    description: "Financial assistance qualification certificate",
    category: "Government Services",
    route: "/dashboard/citizen/services/certificate-of-indigency",
  },

  // --- Health Services ---
  {
    id: 6,
    icon: Heart,
    name: "Health Certificate",
    description: "Medical clearance",
    category: "Health Services",
    route: "/dashboard/citizen/services/health-certificate",
  },
  {
    id: 7,
    icon: Heart,
    name: "Medical Assistance",
    description: "Request medical aid",
    category: "Health Services",
    route: "/dashboard/citizen/services/medical-assistance",
  },
];

// Fixed category order so the "All" view reads as clean sections.
const categoryOrder = [
  "Public Safety",
  "Government Services",
  "Health Services",
];
const categories = ["All", ...categoryOrder];

export default function ServicesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const router = useRouter();

  const filteredGuides = guides.filter((guide) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      guide.name.toLowerCase().includes(q) ||
      guide.description.toLowerCase().includes(q) ||
      guide.category.toLowerCase().includes(q);
    const matchesCategory =
      activeCategory === "All" || guide.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedGuides = categoryOrder
    .map((category) => ({
      category,
      items: filteredGuides.filter((g) => g.category === category),
    }))
    .filter((group) => group.items.length > 0);

  // No auth check here. Login is checked on the Submit button of each form.
  const handleServiceAccess = (route: string) => {
    router.push(route);
  };

  const renderCard = (guide: (typeof guides)[number]) => {
    const Icon = guide.icon;
    return (
      <button
        key={guide.id}
        onClick={() => handleServiceAccess(guide.route)}
        className="group flex h-full flex-col rounded-2xl border border-[#D5E5D4] bg-white p-6 text-left transition-colors hover:border-[#F47B20] focus:outline-none focus-visible:border-[#F47B20] focus-visible:ring-4 focus-visible:ring-[#F47B20]/20"
      >
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4F1E4] text-[#1F6B2E] transition-colors group-hover:bg-[#1F6B2E] group-hover:text-white">
          <Icon className="h-6 w-6" />
        </span>
        <h4 className="mb-1.5 text-lg font-bold leading-snug text-gray-900">
          {guide.name}
        </h4>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          {guide.description}
        </p>
        <span
          className="mt-auto inline-flex items-center gap-1 text-sm font-semibold"
          style={{ color: GREEN }}
        >
          Apply now
          <ChevronRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            style={{ color: ORANGE }}
          />
        </span>
      </button>
    );
  };

  return (
    <section className="bg-[#F4F8F3] py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: GREEN }}
            >
              <FileText className="h-5 w-5" />
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
            Our Services
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            Request certificates, permits, and assistance online.
          </p>
        </div>

        {/* Search + filters */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services"
              aria-label="Search services"
              className="w-full rounded-full border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#1F6B2E] focus:outline-none focus:ring-4 focus:ring-[#1F6B2E]/15"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? "bg-[#1F6B2E] text-white"
                    : "border border-[#D5E5D4] bg-white text-gray-700 hover:border-[#1F6B2E]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped by category */}
        {groupedGuides.map((group) => (
          <div key={group.category} className="mb-14 last:mb-0">
            {activeCategory === "All" && (
              <div className="mb-6 flex items-center gap-3">
                <span
                  className="h-6 w-1 rounded-full"
                  style={{ backgroundColor: ORANGE }}
                />
                <h3 className="text-xl font-bold" style={{ color: GREEN_DARK }}>
                  {group.category}
                </h3>
                <span className="rounded-full bg-[#E4F1E4] px-2.5 py-0.5 text-xs font-semibold text-[#1F6B2E]">
                  {group.items.length}
                </span>
                <div className="h-px flex-1 bg-[#D5E5D4]" />
              </div>
            )}
            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map(renderCard)}
            </div>
          </div>
        ))}

        {/* Empty */}
        {filteredGuides.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#BCD6BB] bg-white py-16 text-center">
            <span
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
              style={{ backgroundColor: GREEN }}
            >
              <Search className="h-7 w-7" />
            </span>
            <h3
              className="mb-2 text-2xl font-bold"
              style={{ color: GREEN_DARK }}
            >
              No services found
            </h3>
            <p className="text-gray-600">
              Try a different keyword or choose another category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
