"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Briefcase,
  ExternalLink,
  Globe,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type LaborMarketLink = {
  id: string;
  country: string;
  agencyName: string;
  url: string;
  description: string | null;
  logoUrl: string | null;
  tags: string | null;
};

interface LaborMarketPageProps {
  links: LaborMarketLink[];
  locale: string;
}

const countryFlags: Record<string, string> = {
  NO: "🇳🇴",
  GR: "🇬🇷",
  TR: "🇹🇷",
  LV: "🇱🇻",
  ES: "🇪🇸",
  IT: "🇮🇹",
  EU: "🇪🇺",
};

const countryColors: Record<string, { bg: string; text: string; border: string }> = {
  NO: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  GR: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  TR: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  LV: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  ES: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  IT: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  EU: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
};

export default function LaborMarketPage({
  links,
  locale,
}: LaborMarketPageProps) {
  const t = useTranslations("laborMarket");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [search, setSearch] = useState("");

  const countries = ["all", ...Array.from(new Set(links.map((l) => l.country)))];

  const filtered = links.filter((link) => {
    const matchCountry =
      selectedCountry === "all" || link.country === selectedCountry;
    const matchSearch =
      !search ||
      link.agencyName.toLowerCase().includes(search.toLowerCase()) ||
      link.description?.toLowerCase().includes(search.toLowerCase());
    return matchCountry && matchSearch;
  });

  const groupedByCountry = filtered.reduce<Record<string, LaborMarketLink[]>>(
    (acc, link) => {
      if (!acc[link.country]) acc[link.country] = [];
      acc[link.country].push(link);
      return acc;
    },
    {}
  );

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      {/* Search + filter bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agencies..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => {
            const flag = country !== "all" ? countryFlags[country] : null;
            const countryName =
              country === "all"
                ? t("allCountries")
                : t(`countries.${country}` as any);
            return (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  selectedCountry === country
                    ? "border-[#1a73e8] bg-[#1a73e8] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#1a73e8]/40"
                )}
              >
                {flag && <span>{flag}</span>}
                {countryName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 flex gap-4 text-sm text-gray-500">
        <span>
          <strong className="text-gray-900">{filtered.length}</strong>{" "}
          {filtered.length === 1 ? "agency" : "agencies"} found
        </span>
        <span>
          <strong className="text-gray-900">
            {Object.keys(groupedByCountry).length}
          </strong>{" "}
          countries
        </span>
      </div>

      {/* Links grouped by country */}
      {Object.keys(groupedByCountry).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Briefcase className="h-7 w-7 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">{t("noLinks")}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByCountry).map(([country, countryLinks]) => {
            const colors = countryColors[country] ?? countryColors.EU;
            const flag = countryFlags[country];
            const countryName = t(`countries.${country}` as any);

            return (
              <div key={country}>
                {/* Country header */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl">{flag}</span>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {countryName}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {countryLinks.length}{" "}
                      {countryLinks.length === 1 ? "agency" : "agencies"}
                    </p>
                  </div>
                </div>

                {/* Agency cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {countryLinks.map((link) => (
                    <div
                      key={link.id}
                      className="card group flex flex-col transition-shadow hover:shadow-md"
                    >
                      {/* Card header */}
                      <div className="mb-3 flex items-start gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg",
                            colors.bg
                          )}
                        >
                          {flag}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                            {link.agencyName}
                          </h3>
                          <span
                            className={cn(
                              "mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-medium",
                              colors.bg,
                              colors.text,
                              colors.border
                            )}
                          >
                            {countryName}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {link.description && (
                        <p className="mb-4 flex-1 text-xs leading-relaxed text-gray-500">
                          {link.description}
                        </p>
                      )}

                      {/* Tags */}
                      {link.tags && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {link.tags.split(",").map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* URL info */}
                      <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
                        <Globe className="h-3 w-3" />
                        <span className="truncate">
                          {new URL(link.url).hostname}
                        </span>
                      </div>

                      {/* CTA */}
                      <div className="flex gap-2 border-t border-gray-100 pt-3">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary flex-1 text-xs py-1.5"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {t("goToJobs")}
                        </a>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary px-3 py-1.5 text-xs"
                        >
                          <Globe className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
