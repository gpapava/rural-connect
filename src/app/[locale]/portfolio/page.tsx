import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PortfolioPage from "@/components/PortfolioPage";

interface PageProps {
  params: { locale: string };
}

export default async function Portfolio({ params: { locale } }: PageProps) {
  const session = await auth();
  if (!session) redirect(`/${locale}/auth/login`);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      portfolio: {
        include: {
          qualifications: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  // Get latest counselor feedback from most recent completed session
  const latestSession = await prisma.counselingSession.findFirst({
    where: { neetUserId: session.user.id, status: "COMPLETED" },
    include: {
      counselor: { select: { id: true, name: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });

  return (
    <PortfolioPage
      user={{
        id: user?.id ?? "",
        name: user?.name ?? "",
        email: user?.email ?? "",
        country: user?.country ?? null,
      }}
      portfolio={user?.portfolio ?? null}
      latestSession={latestSession}
      locale={locale}
    />
  );
}
