"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { AdminStats } from "@/lib/adminStats";

type Views = AdminStats["pageViews"];

// Days are stored as UTC calendar days, so format them in UTC too.
const formatDay = (day: string, locale: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString(locale, { day: "numeric", month: "short", timeZone: "UTC" });

function DailyChart({ daily, locale }: { daily: Views["daily"]; locale: string }) {
  const t = useTranslations("admin.stats");
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...daily.map((d) => d.views));
  const shown = active === null ? null : daily[active];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-700">{t("viewsDaily")}</h3>
        <p className="text-xs text-gray-500" aria-live="polite">
          {shown ? `${formatDay(shown.day, locale)}: ${t("viewsCount", { count: shown.views })}` : t("viewsMax", { count: Math.max(...daily.map((d) => d.views)) })}
        </p>
      </div>
      <div className="flex h-40 items-stretch gap-0.5 border-b border-gray-200" onMouseLeave={() => setActive(null)}>
        {daily.map((d, i) => (
          <button
            key={d.day}
            type="button"
            className="group flex flex-1 items-end justify-center"
            aria-label={`${formatDay(d.day, locale)}: ${t("viewsCount", { count: d.views })}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            <span
              className="w-full max-w-[24px] rounded-t bg-blue-600 group-hover:opacity-70"
              style={{ height: d.views > 0 ? `max(2px, ${(d.views / max) * 100}%)` : 0 }}
            />
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>{formatDay(daily[0].day, locale)}</span>
        <span>{formatDay(daily[daily.length - 1].day, locale)}</span>
      </div>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: { key: string; label: string; views: number }[] }) {
  const t = useTranslations("admin.stats");
  const max = Math.max(0, ...rows.map((r) => r.views));
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{title}</h3>
      <div className="space-y-2">
        {rows.length === 0 && <p className="text-sm text-gray-500">{t("noData")}</p>}
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-3 text-sm">
            <span className="w-32 shrink-0 truncate text-gray-700">{r.label}</span>
            <div className="h-2.5 flex-1 rounded-full bg-gray-100">
              <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${max > 0 ? (r.views / max) * 100 : 0}%` }} />
            </div>
            <span className="min-w-[2rem] text-right font-medium text-gray-900">{r.views}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PageViewsSection({ views, locale }: { views: Views; locale: string }) {
  const t = useTranslations("admin.stats");
  const tLangs = useTranslations("common.languages");

  const totals = [
    { label: t("viewsToday"), value: views.today },
    { label: t("viewsLast30"), value: views.last30 },
    { label: t("viewsTotal"), value: views.total },
  ];

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">{t("viewsTitle")}</h2>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {totals.map((x) => (
          <div key={x.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium text-gray-500">{x.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{x.value.toLocaleString(locale)}</p>
          </div>
        ))}
      </div>

      <DailyChart daily={views.daily} locale={locale} />

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Breakdown
          title={t("viewsByLanguage")}
          rows={views.byLanguage.map((r) => ({ ...r, label: tLangs.has(r.key) ? tLangs(r.key) : r.key }))}
        />
        <Breakdown
          title={t("viewsByAudience")}
          rows={views.byAudience.map((r) => ({ ...r, label: t(`audience.${r.key}`) }))}
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
            <tr>
              <th className="px-4 py-2">{t("viewsPage")}</th>
              <th className="px-4 py-2 text-right">{t("viewsLast30")}</th>
              <th className="px-4 py-2 text-right">{t("viewsTotal")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {views.byPage.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-gray-500">{t("noData")}</td>
              </tr>
            )}
            {views.byPage.map((p) => (
              <tr key={p.path}>
                <td className="px-4 py-2 text-gray-900">{t(`pages.${p.path.replace(/[^a-z]+/g, "_").replace(/^_|_$/g, "")}`)}</td>
                <td className="px-4 py-2 text-right">{p.last30}</td>
                <td className="px-4 py-2 text-right">{p.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {views.since ? t("viewsSince", { date: formatDay(views.since, locale) }) + " " : ""}
        {t("viewsNote")}
      </p>
    </section>
  );
}
