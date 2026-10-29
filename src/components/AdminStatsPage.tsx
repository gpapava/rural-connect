"use client";

import { useTranslations } from "next-intl";
import { Users, UserCheck, GraduationCap, MessageSquare, Award, Download, CalendarCheck } from "lucide-react";
import type { AdminStats } from "@/lib/adminStats";

function StatCard({ icon: Icon, label, value, hint }: { icon: React.ElementType; label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
        <Icon className="h-4 w-4 text-primary-600" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-32 shrink-0 truncate text-gray-700">{label}</span>
      <div className="h-2.5 flex-1 rounded-full bg-gray-100">
        <div className="h-2.5 rounded-full bg-primary-600" style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }} />
      </div>
      <span className="w-8 text-right font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function AdminStatsPage({ stats, locale }: { stats: AdminStats; locale: string }) {
  const t = useTranslations("admin.stats");
  const tCountries = useTranslations("common.countries");
  const tLangs = useTranslations("common.languages");
  const tStages = useTranslations("stages");
  const { users, learning, counselling } = stats;

  const countryLabel = (code: string) => (code && tCountries.has(code) ? tCountries(code) : code || t("unknown"));
  const langLabel = (code: string) => (tLangs.has(code) ? tLangs(code) : code);
  const maxCountry = Math.max(0, ...users.byCountry.map((c) => c.count));
  const maxLang = Math.max(0, ...users.byLanguage.map((c) => c.count));
  const maxMonth = Math.max(0, ...users.monthly.map((m) => m.count));
  const maxSession = Math.max(0, ...counselling.sessionsByStatus.map((s) => s.count));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500">{t("updated", { date: new Date(stats.generatedAt).toLocaleString(locale) })}</p>
        </div>
        <a href="/api/admin/stats/export" className="btn-primary">
          <Download className="h-4 w-4" />
          {t("exportCsv")}
        </a>
      </div>

      <Section title={t("usersTitle")}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard icon={Users} label={t("neets")} value={users.neets} hint={t("neetsLast30", { count: users.neetsLast30 })} />
          <StatCard icon={UserCheck} label={t("counselors")} value={users.counselors} />
          <StatCard icon={Users} label={t("admins")} value={users.admins} />
          <StatCard icon={Award} label={t("gdpr")} value={users.neetsGdpr} hint={t("ofNeets", { count: users.neets })} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">{t("byCountry")}</h3>
            <div className="space-y-2">
              {users.byCountry.length === 0 && <p className="text-sm text-gray-500">{t("noData")}</p>}
              {users.byCountry.map((c) => (
                <Bar key={c.key} label={countryLabel(c.key)} value={c.count} max={maxCountry} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">{t("byLanguage")}</h3>
            <div className="space-y-2">
              {users.byLanguage.length === 0 && <p className="text-sm text-gray-500">{t("noData")}</p>}
              {users.byLanguage.map((l) => (
                <Bar key={l.key} label={langLabel(l.key)} value={l.count} max={maxLang} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <h3 className="px-4 pt-4 text-sm font-semibold text-gray-700">{t("countryRoleTitle")}</h3>
          <table className="mt-3 w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
              <tr>
                <th className="px-4 py-2">{t("colCountry")}</th>
                <th className="px-4 py-2 text-right">{t("colNeets")}</th>
                <th className="px-4 py-2 text-right">{t("colCounselors")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.countryRole.map((r) => (
                <tr key={r.key || "none"}>
                  <td className="px-4 py-2 text-gray-900">{countryLabel(r.key)}</td>
                  <td className="px-4 py-2 text-right">{r.neets}</td>
                  <td className="px-4 py-2 text-right">{r.counselors}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2">Σ</td>
                <td className="px-4 py-2 text-right">{users.countryRole.reduce((n, r) => n + r.neets, 0)}</td>
                <td className="px-4 py-2 text-right">{users.countryRole.reduce((n, r) => n + r.counselors, 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">{t("registrations")}</h3>
          <div className="space-y-2">
            {users.monthly.map((m) => (
              <Bar key={m.month} label={m.month} value={m.count} max={maxMonth} />
            ))}
          </div>
        </div>
      </Section>

      <Section title={t("learningTitle")}>
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            icon={GraduationCap}
            label={t("activeLearners")}
            value={learning.learners}
            hint={t("pctOfNeets", { pct: learning.learnersPct })}
          />
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
              <tr>
                <th className="px-4 py-2">{t("module")}</th>
                <th className="px-4 py-2">{t("language")}</th>
                <th className="px-4 py-2 text-right">{t("started")}</th>
                <th className="px-4 py-2 text-right">{t("inProgress")}</th>
                <th className="px-4 py-2 text-right">{t("completed")}</th>
                <th className="px-4 py-2 text-right">{t("completionRate")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {learning.modules.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-2 text-gray-900">{m.title}</td>
                  <td className="px-4 py-2 text-gray-600">{langLabel(m.language)}</td>
                  <td className="px-4 py-2 text-right">{m.started}</td>
                  <td className="px-4 py-2 text-right">{m.inProgress}</td>
                  <td className="px-4 py-2 text-right">{m.completed}</td>
                  <td className="px-4 py-2 text-right">{m.started > 0 ? `${m.completionRate}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500">{t("quizNote")}</p>
      </Section>

      <Section title={t("counsellingTitle")}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            icon={Users}
            label={t("neetsWithSession")}
            value={counselling.neetsWithSession}
            hint={t("pctOfNeets", { pct: counselling.neetsWithSessionPct })}
          />
          <StatCard icon={CalendarCheck} label={t("sessions")} value={counselling.sessionsTotal} />
          <StatCard icon={MessageSquare} label={t("messages")} value={counselling.messages} />
          <StatCard icon={Award} label={t("certificates")} value={counselling.certificates} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">{t("sessionsByStatus")}</h3>
            <div className="space-y-2">
              {counselling.sessionsByStatus.map((s) => (
                <Bar key={s.key} label={t(`status.${s.key}`)} value={s.count} max={maxSession} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">{t("stagesProgress")}</h3>
            <table className="w-full text-sm">
              <thead className="text-left text-xs font-semibold text-gray-500">
                <tr>
                  <th className="py-1">{t("stage")}</th>
                  <th className="py-1 text-right">{t("stageActive")}</th>
                  <th className="py-1 text-right">{t("completed")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {counselling.stages.map((s) => (
                  <tr key={s.number}>
                    <td className="py-1.5 text-gray-900">
                      {s.number}. {tStages(`names.${s.number}`)}
                    </td>
                    <td className="py-1.5 text-right">{s.active}</td>
                    <td className="py-1.5 text-right">{s.completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
              <tr>
                <th className="px-4 py-2">{t("counselor")}</th>
                <th className="px-4 py-2">{t("country")}</th>
                <th className="px-4 py-2 text-right">{t("neets")}</th>
                <th className="px-4 py-2 text-right">{t("sessions")}</th>
                <th className="px-4 py-2 text-right">{t("sessionsCompleted")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {counselling.counselors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-gray-500">{t("noData")}</td>
                </tr>
              )}
              {counselling.counselors.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-2 text-gray-900">{c.name}</td>
                  <td className="px-4 py-2 text-gray-600">{c.country ? countryLabel(c.country) : "—"}</td>
                  <td className="px-4 py-2 text-right">{c.neets}</td>
                  <td className="px-4 py-2 text-right">{c.sessions}</td>
                  <td className="px-4 py-2 text-right">{c.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
