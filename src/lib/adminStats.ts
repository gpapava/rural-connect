import { prisma } from "@/lib/prisma";

export type AdminStats = Awaited<ReturnType<typeof getAdminStats>>;

const MONTHS_BACK = 12;

export async function getAdminStats() {
  const now = new Date();
  const monthsStart = new Date(now.getFullYear(), now.getMonth() - (MONTHS_BACK - 1), 1);
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    roleGroups,
    neetsLast30,
    neetsGdpr,
    neetCountry,
    neetLanguage,
    recentNeets,
    modules,
    progressGroups,
    sessionGroups,
    stageGroups,
    messageCount,
    certificateCount,
    neetsWithSession,
    counselors,
    counselorSessionGroups,
    counselorNeetPairs,
    countryRoleGroups,
    neetsLoggedIn,
    neetsActive30,
    counselorsLoggedIn,
  ] = await Promise.all([
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
    prisma.user.count({ where: { role: "NEET_USER", createdAt: { gte: last30 } } }),
    prisma.user.count({ where: { role: "NEET_USER", gdprConsent: true } }),
    prisma.user.groupBy({ by: ["country"], where: { role: "NEET_USER" }, _count: { _all: true } }),
    prisma.user.groupBy({ by: ["language"], where: { role: "NEET_USER" }, _count: { _all: true } }),
    prisma.user.findMany({
      where: { role: "NEET_USER", createdAt: { gte: monthsStart } },
      select: { createdAt: true },
    }),
    prisma.module.findMany({
      orderBy: [{ language: "asc" }, { order: "asc" }],
      select: { id: true, title: true, language: true, order: true },
    }),
    prisma.userModuleProgress.groupBy({
      by: ["moduleId", "status"],
      where: { user: { role: "NEET_USER" } },
      _count: { _all: true },
    }),
    prisma.counselingSession.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.counselingStage.groupBy({ by: ["number", "status"], _count: { _all: true } }),
    prisma.message.count(),
    prisma.certificate.count(),
    prisma.counselingSession.findMany({ distinct: ["neetUserId"], select: { neetUserId: true } }),
    prisma.user.findMany({
      where: { role: "COUNSELOR" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, country: true },
    }),
    prisma.counselingSession.groupBy({ by: ["counselorId", "status"], _count: { _all: true } }),
    prisma.counselingStage.findMany({ distinct: ["neetUserId", "counselorId"], select: { neetUserId: true, counselorId: true } }),
    prisma.user.groupBy({ by: ["country", "role"], _count: { _all: true } }),
    prisma.user.count({ where: { role: "NEET_USER", lastLoginAt: { not: null } } }),
    prisma.user.count({ where: { role: "NEET_USER", lastLoginAt: { gte: last30 } } }),
    prisma.user.count({ where: { role: "COUNSELOR", lastLoginAt: { not: null } } }),
  ]);

  const roleCount = (role: string) => roleGroups.find((g) => g.role === role)?._count._all ?? 0;
  const neets = roleCount("NEET_USER");

  // Registrations per month, oldest first, zero-filled.
  const monthly: { month: string; count: number }[] = [];
  for (let i = 0; i < MONTHS_BACK; i++) {
    const d = new Date(monthsStart.getFullYear(), monthsStart.getMonth() + i, 1);
    monthly.push({ month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, count: 0 });
  }
  for (const u of recentNeets) {
    const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, "0")}`;
    const row = monthly.find((m) => m.month === key);
    if (row) row.count++;
  }

  const byCountry = neetCountry
    .map((g) => ({ key: g.country ?? "", count: g._count._all }))
    .sort((a, b) => b.count - a.count);
  const countryRole = Array.from(new Set(countryRoleGroups.map((g) => g.country ?? "")))
    .map((key) => {
      const n = (role: string) => countryRoleGroups.find((g) => (g.country ?? "") === key && g.role === role)?._count._all ?? 0;
      return { key, neets: n("NEET_USER"), counselors: n("COUNSELOR") };
    })
    .filter((r) => r.neets > 0 || r.counselors > 0)
    .sort((a, b) => b.neets + b.counselors - (a.neets + a.counselors));
  const byLanguage = neetLanguage
    .map((g) => ({ key: g.language, count: g._count._all }))
    .sort((a, b) => b.count - a.count);

  // Learning: per module started / completed.
  const moduleRows = modules.map((m) => {
    const of = (status: string) =>
      progressGroups.find((g) => g.moduleId === m.id && g.status === status)?._count._all ?? 0;
    const inProgress = of("IN_PROGRESS");
    const completed = of("COMPLETED");
    const started = inProgress + completed;
    return {
      id: m.id,
      title: m.title,
      language: m.language,
      inProgress,
      completed,
      started,
      completionRate: started > 0 ? Math.round((completed / started) * 100) : 0,
    };
  });
  const learners = await prisma.userModuleProgress.findMany({
    where: { status: { in: ["IN_PROGRESS", "COMPLETED"] }, user: { role: "NEET_USER" } },
    distinct: ["userId"],
    select: { userId: true },
  });

  // Counselling.
  const sessionStatus = (s: string) => sessionGroups.find((g) => g.status === s)?._count._all ?? 0;
  const sessionsByStatus = ["PENDING", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((s) => ({
    key: s,
    count: sessionStatus(s),
  }));
  const sessionsTotal = sessionsByStatus.reduce((n, s) => n + s.count, 0);

  const stages = [1, 2, 3, 4, 5].map((number) => {
    const of = (status: string) =>
      stageGroups.find((g) => g.number === number && g.status === status)?._count._all ?? 0;
    return { number, active: of("ACTIVE"), completed: of("COMPLETED") };
  });

  const counselorRows = counselors.map((c) => {
    const of = (status: string) =>
      counselorSessionGroups.find((g) => g.counselorId === c.id && g.status === status)?._count._all ?? 0;
    const total = ["PENDING", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].reduce((n, s) => n + of(s), 0);
    return {
      id: c.id,
      name: c.name,
      country: c.country,
      neets: counselorNeetPairs.filter((p) => p.counselorId === c.id).length,
      sessions: total,
      completed: of("COMPLETED"),
    };
  });

  return {
    generatedAt: now,
    users: {
      neets,
      counselors: roleCount("COUNSELOR"),
      admins: roleCount("ADMIN"),
      neetsLast30,
      neetsGdpr,
      neetsLoggedIn,
      neetsActive30,
      counselorsLoggedIn,
      byCountry,
      byLanguage,
      countryRole,
      monthly,
    },
    learning: {
      learners: learners.length,
      learnersPct: neets > 0 ? Math.round((learners.length / neets) * 100) : 0,
      modules: moduleRows,
    },
    counselling: {
      neetsWithSession: neetsWithSession.length,
      neetsWithSessionPct: neets > 0 ? Math.round((neetsWithSession.length / neets) * 100) : 0,
      sessionsTotal,
      sessionsByStatus,
      stages,
      messages: messageCount,
      certificates: certificateCount,
      counselors: counselorRows,
    },
  };
}

function csvCell(v: string | number | null): string {
  const s = v === null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Flat CSV (section,label,metric,value) — easy to pivot in Excel for partner reports. */
export function statsToCsv(s: AdminStats): string {
  const rows: (string | number | null)[][] = [["section", "label", "metric", "value"]];
  const add = (section: string, label: string, metric: string, value: number) =>
    rows.push([section, label, metric, value]);

  add("users", "", "neets", s.users.neets);
  add("users", "", "counselors", s.users.counselors);
  add("users", "", "admins", s.users.admins);
  add("users", "", "neets_registered_last_30_days", s.users.neetsLast30);
  add("users", "", "neets_with_gdpr_consent", s.users.neetsGdpr);
  add("users", "", "neets_logged_in_since_tracking", s.users.neetsLoggedIn);
  add("users", "", "neets_active_last_30_days", s.users.neetsActive30);
  add("users", "", "counselors_logged_in_since_tracking", s.users.counselorsLoggedIn);
  s.users.byCountry.forEach((c) => add("neets_by_country", c.key || "unknown", "neets", c.count));
  s.users.countryRole.forEach((c) => {
    add("country_role", c.key || "unknown", "neets", c.neets);
    add("country_role", c.key || "unknown", "counselors", c.counselors);
  });
  s.users.byLanguage.forEach((l) => add("neets_by_language", l.key, "neets", l.count));
  s.users.monthly.forEach((m) => add("neet_registrations", m.month, "neets", m.count));

  add("learning", "", "neets_who_started_a_module", s.learning.learners);
  s.learning.modules.forEach((m) => {
    const label = `${m.language} | ${m.title}`;
    add("module", label, "started", m.started);
    add("module", label, "in_progress", m.inProgress);
    add("module", label, "completed", m.completed);
  });

  add("counselling", "", "neets_with_a_session", s.counselling.neetsWithSession);
  add("counselling", "", "sessions_total", s.counselling.sessionsTotal);
  s.counselling.sessionsByStatus.forEach((x) => add("sessions_by_status", x.key, "sessions", x.count));
  s.counselling.stages.forEach((x) => {
    add("stage", `stage_${x.number}`, "active", x.active);
    add("stage", `stage_${x.number}`, "completed", x.completed);
  });
  add("counselling", "", "messages", s.counselling.messages);
  add("counselling", "", "certificates_issued", s.counselling.certificates);
  s.counselling.counselors.forEach((c) => {
    add("counselor", c.name, "neets", c.neets);
    add("counselor", c.name, "sessions", c.sessions);
    add("counselor", c.name, "sessions_completed", c.completed);
  });

  return rows.map((r) => r.map(csvCell).join(",")).join("\n") + "\n";
}
