import { prisma } from "@/lib/prisma";

export async function getOrCreateStages(neetUserId: string, counselorId: string) {
  const existing = await prisma.counselingStage.findMany({
    where: { neetUserId, counselorId },
    orderBy: { number: "asc" },
  });

  if (existing.length === 5) return existing;

  // Create all 5 stages; stage 1 starts ACTIVE, rest LOCKED
  await prisma.counselingStage.createMany({
    data: [1, 2, 3, 4, 5].map((n) => ({
      neetUserId,
      counselorId,
      number: n,
      status: n === 1 ? ("ACTIVE" as const) : ("LOCKED" as const),
    })),
    skipDuplicates: true,
  });

  return prisma.counselingStage.findMany({
    where: { neetUserId, counselorId },
    orderBy: { number: "asc" },
  });
}
