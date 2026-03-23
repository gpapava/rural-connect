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

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      portfolio: {
        include: { qualifications: true },
      },
      moduleProgress: {
        include: { module: true },
        orderBy: { updatedAt: "desc" },
      },
      neetSessions: {
        where: { status: { in: ["SCHEDULED", "IN_PROGRESS"] } },
        include: {
          counselor: {
            select: { id: true, name: true, email: true, country: true },
          },
        },
        orderBy: { scheduledAt: "asc" },
        take: 1,
      },
    },
  });

  const totalModules = await prisma.module.count();
  const completedModules =
    user?.moduleProgress.filter((p) => p.status === "COMPLETED").length ?? 0;
  const inProgressModules =
    user?.moduleProgress.filter((p) => p.status === "IN_PROGRESS").length ?? 0;

  const completedSessions = await prisma.counselingSession.count({
    where: { neetUserId: session.user.id, status: "COMPLETED" },
  });

  const dashboardData = {
    user: {
      id: user?.id ?? "",
      name: user?.name ?? "",
      email: user?.email ?? "",
      country: user?.country ?? null,
    },
    upcomingSession: user?.neetSessions[0] ?? null,
    portfolio: user?.portfolio ?? null,
    moduleStats: {
      total: totalModules,
      completed: completedModules,
      inProgress: inProgressModules,
      notStarted: totalModules - completedModules - inProgressModules,
    },
    stats: {
      sessionsCompleted: completedSessions,
      modulesFinished: completedModules,
      daysActive: Math.floor(
        (Date.now() - new Date(user?.createdAt ?? Date.now()).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    },
  };

  return <DashboardPage data={dashboardData} locale={locale} />;
}
