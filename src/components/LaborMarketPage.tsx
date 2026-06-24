"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Briefcase, ExternalLink, Globe, Search, Mail, MapPin,
  Building2, Plus, Clock,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";

type LaborMarketLink = {
  id: string;
  country: string;
  agencyName: string;
  url: string;
  description: string | null;
  logoUrl: string | null;
  tags: string | null;
};

type JobOpening = {
  id: string;
  title: string;
  company: string;
  description: string;
  country: string;
  location: string | null;
  contactName: string;
  contactEmail: string;
  website: string | null;
  createdAt: Date;
};

interface LaborMarketPageProps {
  links: LaborMarketLink[];
  jobs: JobOpening[];
  locale: string;
}

const countryFlags: Record<string, string> = {
  NO: "🇳🇴", GR: "🇬🇷", TR: "🇹🇷", LV: "🇱🇻", ES: "🇪🇸", IT: "🇮🇹", EU: "🇪🇺",
};

const countryColors: Record<string, { bg: string; text: string; border: string }> = {
  NO: { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200"    },
  GR: { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  TR: { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200"    },
  LV: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  ES: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  IT: { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200"  },
  EU: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
};

const countryNames: Record<string, string> = {
  NO: "Norway", GR: "Greece", TR: "Turkey", LV: "Latvia", ES: "Spain", IT: "Italy", EU: "European Union",
};

type Tab = "agencies" | "jobs";

export default function LaborMarketPage({ links, jobs, locale }: LaborMarketPageProps) {
  const t = useTranslations("laborMarket");
  const [tab, setTab] = useState<Tab>("agencies");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [search, setSearch] = useState("");

  // Countries for agencies
  const agencyCountries = ["all", ...Array.from(new Set(links.map((l) => l.country)))];
  // Countries for jobs
  const jobCountries = ["all", ...Array.from(new Set(jobs.map((j) => j.country)))];
  const activeCountries = tab === "agencies" ? agencyCountries : jobCountries;

  // Reset country filter when switching tabs
  const handleTabChange = (t: Tab) => {
    setTab(t);
    setSelectedCountry("all");
    setSearch("");
  };

  const filteredLinks = links.filter((link) => {
    const matchCountry = selectedCountry === "all" || link.country === selectedCountry;
    const matchSearch = !search || link.agencyName.toLowerCase().includes(search.toLowerCase()) || link.description?.toLowerCase().includes(search.toLowerCase());
    return matchCountry && matchSearch;
  });

  const filteredJobs = jobs.filter((job) => {
    const matchCountry = selectedCountry === "all" || job.country === selectedCountry;
    const matchSearch = !search || job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase()) || job.description.toLowerCase().includes(search.toLowerCase());
    return matchCountry && matchSearch;
  });

  const groupedLinks = filteredLinks.reduce<Record<string, LaborMarketLink[]>>((acc, link) => {
    if (!acc[link.country]) acc[link.country] = [];
    acc[link.country].push(link);
    return acc;
  }, {});

  const groupedJobs = filteredJobs.reduce<Record<string, JobOpening[]>>((acc, job) => {
    if (!acc[job.country]) acc[job.country] = [];
    acc[job.country].push(job);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500">{t("subtitle")}</p>
        </div>
        <Link
          href={`/${locale}/jobs/new`}
          className="flex flex-shrink-0 items-center gap-2 rounded-lg border border-[#1a73e8]/30 bg-[#1a73e8]/5 px-4 py-2 text-sm font-medium text-[#1a73e8] hover:bg-[#1a73e8]/10 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Post a Job Opening
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 w-fit">
        <button
          onClick={() => handleTabChange("agencies")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-all",
            tab === "agencies"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Employment Agencies
          <span className="ml-2 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
            {links.length}
          </span>
        </button>
        <button
          onClick={() => handleTabChange("jobs")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-all",
            tab === "jobs"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Job Openings
          {jobs.length > 0 && (
            <span className="ml-2 rounded-full bg-[#1a73e8] px-1.5 py-0.5 text-xs text-white">
              {jobs.length}
            </span>
          )}
        </button>
      </div>

      {/* Search + country filter */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === "agencies" ? "Search agencies…" : "Search job openings…"}
            className="input-field pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {activeCountries.map((country) => {
            const flag = country !== "all" ? countryFlags[country] : null;
            const name = country === "all" ? t("allCountries") : (countryNames[country] ?? country);
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
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Agencies tab ── */}
      {tab === "agencies" && (
        <>
          <div className="mb-6 flex gap-4 text-sm text-gray-500">
            <span><strong className="text-gray-900">{filteredLinks.length}</strong> {filteredLinks.length === 1 ? "agency" : "agencies"} found</span>
          </div>

          {Object.keys(groupedLinks).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Briefcase className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">{t("noLinks")}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedLinks).map(([country, countryLinks]) => {
                const colors = countryColors[country] ?? countryColors.EU;
                const flag = countryFlags[country];
                const cName = countryNames[country] ?? country;
                return (
                  <div key={country}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-2xl">{flag}</span>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{cName}</h2>
                        <p className="text-xs text-gray-500">{countryLinks.length} {countryLinks.length === 1 ? "agency" : "agencies"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {countryLinks.map((link) => (
                        <div key={link.id} className="card group flex flex-col transition-shadow hover:shadow-md">
                          <div className="mb-3 flex items-start gap-3">
                            <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg", colors.bg)}>
                              {flag}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 leading-tight">{link.agencyName}</h3>
                              <span className={cn("mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-medium", colors.bg, colors.text, colors.border)}>
                                {cName}
                              </span>
                            </div>
                          </div>
                          {link.description && <p className="mb-4 flex-1 text-xs leading-relaxed text-gray-500">{link.description}</p>}
                          {link.tags && (
                            <div className="mb-3 flex flex-wrap gap-1">
                              {link.tags.split(",").map((tag) => (
                                <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{tag.trim()}</span>
                              ))}
                            </div>
                          )}
                          <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
                            <Globe className="h-3 w-3" />
                            <span className="truncate">{new URL(link.url).hostname}</span>
                          </div>
                          <div className="flex gap-2 border-t border-gray-100 pt-3">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 text-xs py-1.5">
                              <ExternalLink className="h-3.5 w-3.5" />
                              {t("goToJobs")}
                            </a>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn-secondary px-3 py-1.5 text-xs">
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
        </>
      )}

      {/* ── Job Openings tab ── */}
      {tab === "jobs" && (
        <>
          <div className="mb-6 flex gap-4 text-sm text-gray-500">
            <span><strong className="text-gray-900">{filteredJobs.length}</strong> {filteredJobs.length === 1 ? "opening" : "openings"} found</span>
          </div>

          {Object.keys(groupedJobs).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Briefcase className="h-7 w-7 text-gray-400" />
              </div>
              <p className="mb-4 text-sm text-gray-500">No job openings available yet.</p>
              <Link
                href={`/${locale}/jobs/new`}
                className="flex items-center gap-2 rounded-lg bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1558b0]"
              >
                <Plus className="h-4 w-4" />
                Post a Job Opening
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedJobs).map(([country, countryJobs]) => {
                const flag = countryFlags[country] ?? "🌍";
                const cName = countryNames[country] ?? country;
                const colors = countryColors[country] ?? countryColors.EU;
                return (
                  <div key={country}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-2xl">{flag}</span>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{cName}</h2>
                        <p className="text-xs text-gray-500">{countryJobs.length} {countryJobs.length === 1 ? "opening" : "openings"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {countryJobs.map((job) => (
                        <div key={job.id} className="card flex flex-col transition-shadow hover:shadow-md">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" /> {job.company}
                                </span>
                                {job.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {job.location}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className={cn("flex-shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium", colors.bg, colors.text, colors.border)}>
                              {flag} {cName}
                            </span>
                          </div>

                          <p className="mb-4 flex-1 text-xs leading-relaxed text-gray-600 line-clamp-3">
                            {job.description}
                          </p>

                          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(job.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {job.website && (
                                <a
                                  href={job.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-500 hover:border-[#1a73e8]/40 hover:text-[#1a73e8]"
                                >
                                  <Globe className="h-3 w-3" />
                                  Website
                                </a>
                              )}
                              <a
                                href={`mailto:${job.contactEmail}`}
                                className="flex items-center gap-1 rounded-lg bg-[#1a73e8] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#1558b0]"
                              >
                                <Mail className="h-3 w-3" />
                                Apply
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
