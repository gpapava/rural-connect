import { prisma } from "@/lib/prisma";
import { getCounsellingProgress } from "@/lib/counsellingProgress";

export type ParticipantRow = {
  id: string;
  name: string;
  email: string;
  country: string | null;
  language: string;
  lastLoginAt: string | null;
  counselor: string | null;
  stagesCompleted: number;
  certificate: boolean;
  counsellingStatus: "completed" | "inprogress" | "none";
  /** moduleId → progress; modules the NEET never opened are simply absent. */
  modules: Record<string, { status: "IN_PROGRESS" | "COMPLETED"; completedAt: string | null }>;
};

export type ModuleCatalog = Record<string, { id: string; title: string }[]>;

/** One row per NEET with learning + counselling progress, plus the module catalogue per language. */
export async function getParticipants(): Promise<{ rows: ParticipantRow[]; catalog: ModuleCatalog }> {
  const [users, progress, counselling, modules] = await Promise.all([
    prisma.user.findMany({
      where: { role: "NEET_USER" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, country: true, language: true, lastLoginAt: true },
    }),
    prisma.userModuleProgress.findMany({
      where: { status: { in: ["IN_PROGRESS", "COMPLETED"] } },
      select: { userId: true, moduleId: true, status: true, completedAt: true },
    }),
    getCounsellingProgress(),
    prisma.module.findMany({ orderBy: [{ language: "asc" }, { order: "asc" }], select: { id: true, title: true, language: true } }),
  ]);

  const byUser: Record<string, ParticipantRow["modules"]> = {};
  for (const p of progress) {
    (byUser[p.userId] ??= {})[p.moduleId] = {
      status: p.status as "IN_PROGRESS" | "COMPLETED",
      completedAt: p.completedAt ? p.completedAt.toISOString() : null,
    };
  }

  const catalog: ModuleCatalog = {};
  for (const m of modules) (catalog[m.language] ??= []).push({ id: m.id, title: m.title });

  const rows = users.map((u) => {
    const c = counselling[u.id];
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      country: u.country,
      language: u.language,
      lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
      counselor: c?.counselor ?? null,
      stagesCompleted: c?.stagesCompleted ?? 0,
      certificate: c?.certificate ?? false,
      counsellingStatus: c?.status ?? ("none" as const),
      modules: byUser[u.id] ?? {},
    };
  });
  return { rows, catalog };
}
