"use client";

import { Fragment, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight, Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ParticipantRow, ModuleCatalog } from "@/lib/participants";

type Props = { rows: ParticipantRow[]; catalog: ModuleCatalog; locale: string };

const fmt = (iso: string | null, locale: string) => (iso ? new Date(iso).toLocaleDateString(locale) : "—");

export default function ParticipantsProgress({ rows, catalog, locale }: Props) {
  const t = useTranslations("admin.stats");
  const tCountries = useTranslations("common.countries");
  const tLangs = useTranslations("common.languages");

  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [learning, setLearning] = useState("all");
  const [counselling, setCounselling] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const countryLabel = (c: string | null) => (c ? (tCountries.has(c) ? tCountries(c) : c) : "—");
  // A NEET's module set is the one in their profile language (English fallback), like the library.
  const setFor = (r: ParticipantRow) => catalog[r.language] ?? catalog.en ?? [];
  const summary = (r: ParticipantRow) => {
    const total = setFor(r).length;
    const done = Object.values(r.modules).filter((m) => m.status === "COMPLETED").length;
    const started = Object.keys(r.modules).length;
    const status = started === 0 ? "none" : total > 0 && done >= total ? "completed" : "inprogress";
    return { total, done, started, status };
  };

  const countries = useMemo(() => Array.from(new Set(rows.map((r) => r.country ?? "none"))).sort(), [rows]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q) && !r.email.toLowerCase().includes(q)) return false;
      if (country !== "all" && (r.country ?? "none") !== country) return false;
      if (learning !== "all" && summary(r).status !== learning) return false;
      if (counselling !== "all" && r.counsellingStatus !== counselling) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, country, learning, counselling, catalog]);

  const exportCsv = () => {
    const esc = (v: string | number) => {
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const head = ["name", "email", "country", "language", "counsellor", "modules_completed", "modules_in_progress", "modules_total", "counselling_stages_completed", "certificate", "last_login"];
    const body = filtered.map((r) => {
      const s = summary(r);
      return [r.name, r.email, r.country ?? "", r.language, r.counselor ?? "", s.done, s.started - s.done, s.total, r.stagesCompleted, r.certificate ? "yes" : "no", r.lastLoginAt ? r.lastLoginAt.slice(0, 10) : ""];
    });
    const csv = "﻿" + [head, ...body].map((row) => row.map(esc).join(",")).join("\n") + "\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `rural-connect-participants-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sel = "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#178593] focus:outline-none";

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">{t("participantsTitle")}</h2>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("participantsSearch")}
            className="w-64 rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-[#178593] focus:outline-none"
          />
        </div>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className={sel} aria-label={t("colCountry")}>
          <option value="all">{t("allCountries")}</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c === "none" ? "—" : countryLabel(c)}</option>
          ))}
        </select>
        <select value={learning} onChange={(e) => setLearning(e.target.value)} className={sel} aria-label={t("colModules")}>
          <option value="all">{t("learningAll")}</option>
          <option value="completed">{t("learningCompleted")}</option>
          <option value="inprogress">{t("learningInProgress")}</option>
          <option value="none">{t("learningNone")}</option>
        </select>
        <select value={counselling} onChange={(e) => setCounselling(e.target.value)} className={sel} aria-label={t("colStages")}>
          <option value="all">{t("counsellingAll")}</option>
          <option value="completed">{t("counsellingCompleted")}</option>
          <option value="inprogress">{t("counsellingInProgress")}</option>
          <option value="none">{t("counsellingNone")}</option>
        </select>
        <button onClick={exportCsv} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[#178593] bg-white px-3 py-2 text-sm font-semibold text-[#178593] hover:bg-[#178593] hover:text-white">
          <Download className="h-4 w-4" />
          {t("exportList")} ({filtered.length})
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
            <tr>
              <th className="w-8 px-3 py-2" />
              <th className="px-3 py-2">{t("colName")}</th>
              <th className="px-3 py-2">{t("colCountry")}</th>
              <th className="px-3 py-2">{t("colCounsellor")}</th>
              <th className="px-3 py-2 text-right">{t("colModules")}</th>
              <th className="px-3 py-2 text-right">{t("colStages")}</th>
              <th className="px-3 py-2">{t("colLastLogin")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-4 text-gray-500">{t("noResults")}</td></tr>
            )}
            {filtered.map((r) => {
              const s = summary(r);
              const isOpen = open === r.id;
              return (
                <Fragment key={r.id}>
                  <tr className="cursor-pointer hover:bg-gray-50" onClick={() => setOpen(isOpen ? null : r.id)}>
                    <td className="px-3 py-2 text-gray-400">{isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</td>
                    <td className="px-3 py-2">
                      <p className="font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.email}</p>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{countryLabel(r.country)}</td>
                    <td className="px-3 py-2 text-gray-600">{r.counselor ?? "—"}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-semibold", s.status === "completed" ? "bg-green-100 text-green-800" : s.status === "inprogress" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500")}>
                        {s.done}/{s.total}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-semibold", r.counsellingStatus === "completed" ? "bg-green-100 text-green-800" : r.counsellingStatus === "inprogress" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500")}>
                        {r.stagesCompleted}/5{r.certificate ? " 🎓" : ""}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-500">{fmt(r.lastLoginAt, locale)}</td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-gray-50/70">
                      <td />
                      <td colSpan={6} className="px-3 py-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {t("modulesOf", { language: tLangs.has(r.language) ? tLangs(r.language) : r.language })}
                        </p>
                        <ul className="grid gap-1 sm:grid-cols-2">
                          {setFor(r).map((m) => {
                            const p = r.modules[m.id];
                            return (
                              <li key={m.id} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-1.5 text-xs">
                                <span className="truncate text-gray-800">{m.title}</span>
                                <span className={cn("flex-shrink-0 font-semibold", p?.status === "COMPLETED" ? "text-green-700" : p ? "text-amber-700" : "text-gray-400")}>
                                  {p?.status === "COMPLETED" ? `${t("moduleCompleted")} · ${fmt(p.completedAt, locale)}` : p ? t("moduleInProgress") : t("moduleNotStarted")}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-500">{t("participantsNote")}</p>
    </section>
  );
}
