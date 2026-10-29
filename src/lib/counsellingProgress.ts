import { prisma } from "@/lib/prisma";

export type CounsellingProgress = {
  /** Name of the counsellor of the NEET's most recent counselling pair, if any. */
  counselor: string | null;
  /** Completed stages (0–5). */
  stagesCompleted: number;
  certificate: boolean;
  /** "completed": all 5 stages done or certificate issued; "inprogress": has a counsellor/sessions; "none": nothing yet. */
  status: "completed" | "inprogress" | "none";
};

/** Per-NEET counselling progress, keyed by user id. NEETs without any session are omitted (treat as "none"). */
export async function getCounsellingProgress(): Promise<Record<string, CounsellingProgress>> {
  const [sessions, stages, certs] = await Promise.all([
    prisma.counselingSession.findMany({
      orderBy: { createdAt: "desc" },
      select: { neetUserId: true, counselor: { select: { name: true } } },
    }),
    prisma.counselingStage.groupBy({
      by: ["neetUserId"],
      where: { status: "COMPLETED" },
      _count: { _all: true },
    }),
    prisma.certificate.findMany({ select: { neetUserId: true } }),
  ]);

  const out: Record<string, CounsellingProgress> = {};
  for (const s of sessions) {
    if (!out[s.neetUserId]) {
      out[s.neetUserId] = { counselor: s.counselor.name, stagesCompleted: 0, certificate: false, status: "inprogress" };
    }
  }
  for (const g of stages) {
    const e = (out[g.neetUserId] ??= { counselor: null, stagesCompleted: 0, certificate: false, status: "inprogress" });
    e.stagesCompleted = Math.min(g._count._all, 5);
  }
  for (const c of certs) {
    const e = (out[c.neetUserId] ??= { counselor: null, stagesCompleted: 0, certificate: false, status: "inprogress" });
    e.certificate = true;
  }
  for (const e of Object.values(out)) {
    e.status = e.stagesCompleted >= 5 || e.certificate ? "completed" : "inprogress";
  }
  return out;
}
