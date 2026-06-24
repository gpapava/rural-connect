import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardPage from "@/components/DashboardPage";

interface PageProps {
  params: { locale: string };
}

export default async function Dashboard({ params: { locale } }: PageProps) {
  const session = await auth();
  if (!session) redirect(`/${locale}/auth/login`);

  const counselorSelect = { id: true, name: true, email: true, country: true };
  const userId = session.user.id;

  const [user, totalModules, completedModules, pendingSession, upcomingSession, stages, certificate] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          country: true,
          createdAt: true,
          portfolio: {
            select: { id: true, summary: true, targetSector: true, updatedAt: true },
          },
          moduleProgress: {
            select: { status: true },
          },
        },
      }),
      prisma.module.count(),
      prisma.userModuleProgress.count({
        where: { userId, status: "COMPLETED" },
      }),
      prisma.counselingSession.findFirst({
        where: { neetUserId: userId, status: "PENDING" },
        select: { id: true, scheduledAt: true, counselor: { select: counselorSelect } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.counselingSession.findFirst({
        where: { neetUserId: userId, status: { in: ["SCHEDULED", "IN_PROGRESS"] } },
        select: { id: true, scheduledAt: true, status: true, counselor: { select: counselorSelect } },
        orderBy: { scheduledAt: "asc" },
      }),
      prisma.counselingStage.findMany({
        where: { neetUserId: userId },
        select: { number: true, status: true },
        orderBy: { number: "asc" },
      }),
      prisma.certificate.findUnique({
        where: { neetUserId: userId },
        select: { id: true, issuedAt: true },
      }),
    ]);

  const inProgressCount = user?.moduleProgress.filter((p) => p.status === "IN_PROGRESS").length ?? 0;

  return (
    <DashboardPage
      data={{
        user: {
          id: user?.id ?? "",
          name: user?.name ?? "",
          email: user?.email ?? "",
          country: user?.country ?? null,
        },
        upcomingSession: upcomingSession ?? null,
        pendingSession: pendingSession ?? null,
        portfolio: user?.portfolio ?? null,
        moduleStats: {
          total: totalModules,
          completed: completedModules,
          inProgress: inProgressCount,
        },
        stages: stages as { number: number; status: "LOCKED" | "ACTIVE" | "COMPLETED" }[],
        certificate: certificate ?? null,
      }}
      locale={locale}
    />
  );
}
