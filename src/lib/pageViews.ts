import { prisma } from "@/lib/prisma";
import { locales } from "@/i18n";

// Only these routes are counted. Anything else (admin pages, redirects, made-up
// URLs) is ignored, so the table cannot be filled with arbitrary values.
const ROUTES: [RegExp, string][] = [
  [/^\/auth\/login$/, "/auth/login"],
  [/^\/auth\/register$/, "/auth/register"],
  [/^\/auth\/change-password$/, "/auth/change-password"],
  [/^\/auth\/invite\/[^/]+$/, "/auth/invite/[id]"], // never store the invite token
  [/^\/dashboard$/, "/dashboard"],
  [/^\/library$/, "/library"],
  [/^\/library\/[^/]+$/, "/library/[id]"],
  [/^\/counseling$/, "/counseling"],
  [/^\/sessions\/new$/, "/sessions/new"],
  [/^\/portfolio$/, "/portfolio"],
  [/^\/labor-market$/, "/labor-market"],
  [/^\/jobs\/new$/, "/jobs/new"],
  [/^\/certificate\/[^/]+$/, "/certificate/[id]"],
];

/** Splits "/el/library/abc" into { locale: "el", path: "/library/[id]" }, or null if not counted. */
export function normalizePath(pathname: string): { locale: string; path: string } | null {
  const [, locale, ...rest] = pathname.replace(/\/+$/, "").split("/");
  if (!(locales as readonly string[]).includes(locale)) return null;
  const route = "/" + rest.join("/");
  const match = ROUTES.find(([re]) => re.test(route));
  return match ? { locale, path: match[1] } : null;
}

const utcDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

export async function recordPageView(view: { locale: string; path: string; audience: string }) {
  const key = { day: utcDay(new Date()), ...view };
  await prisma.pageViewStat.upsert({
    where: { day_path_locale_audience: key },
    create: { ...key, views: 1 },
    update: { views: { increment: 1 } },
  });
}

const DAYS = 30;
const MONTHS = 12;

export async function getPageViewStats(now = new Date()) {
  const today = utcDay(now);
  const from30 = new Date(today.getTime() - (DAYS - 1) * 24 * 60 * 60 * 1000);
  const fromMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - (MONTHS - 1), 1));
  const recent = { day: { gte: from30 } };

  const [totals, first, days, pages, pagesTotal, languages, audiences] = await Promise.all([
    prisma.pageViewStat.aggregate({ _sum: { views: true } }),
    prisma.pageViewStat.aggregate({ _min: { day: true } }),
    prisma.pageViewStat.groupBy({ by: ["day"], where: { day: { gte: fromMonth } }, _sum: { views: true } }),
    prisma.pageViewStat.groupBy({ by: ["path"], where: recent, _sum: { views: true } }),
    prisma.pageViewStat.groupBy({ by: ["path"], _sum: { views: true } }),
    prisma.pageViewStat.groupBy({ by: ["locale"], where: recent, _sum: { views: true } }),
    prisma.pageViewStat.groupBy({ by: ["audience"], where: recent, _sum: { views: true } }),
  ]);

  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const perDay = new Map(days.map((d) => [iso(d.day), d._sum.views ?? 0]));

  // Both series are zero-filled, oldest first.
  const daily = Array.from({ length: DAYS }, (_, i) => {
    const day = iso(new Date(from30.getTime() + i * 24 * 60 * 60 * 1000));
    return { day, views: perDay.get(day) ?? 0 };
  });
  const monthly = Array.from({ length: MONTHS }, (_, i) => {
    const month = iso(new Date(Date.UTC(fromMonth.getUTCFullYear(), fromMonth.getUTCMonth() + i, 1))).slice(0, 7);
    let views = 0;
    perDay.forEach((v, day) => {
      if (day.startsWith(month)) views += v;
    });
    return { month, views };
  });

  const byPage = pagesTotal
    .map((p) => ({
      path: p.path,
      last30: pages.find((r) => r.path === p.path)?._sum.views ?? 0,
      total: p._sum.views ?? 0,
    }))
    .sort((a, b) => b.last30 - a.last30 || b.total - a.total);
  const ranked = <T extends { _sum: { views: number | null } }>(rows: T[], key: (r: T) => string) =>
    rows.map((r) => ({ key: key(r), views: r._sum.views ?? 0 })).sort((a, b) => b.views - a.views);

  return {
    since: first._min.day ? iso(first._min.day) : null,
    total: totals._sum.views ?? 0,
    today: daily[daily.length - 1].views,
    last30: daily.reduce((n, d) => n + d.views, 0),
    daily,
    monthly,
    byPage,
    byLanguage: ranked(languages, (r) => r.locale),
    byAudience: ranked(audiences, (r) => r.audience),
  };
}
