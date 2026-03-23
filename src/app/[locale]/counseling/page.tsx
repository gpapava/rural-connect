import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CounselingPage from "@/components/CounselingPage";

interface PageProps {
  params: { locale: string };
}

export default async function Counseling({ params: { locale } }: PageProps) {
  const session = await auth();
  if (!session) redirect(`/${locale}/auth/login`);

  // Get most recent active session
  const counselingSession = await prisma.counselingSession.findFirst({
    where: {
      OR: [
        { neetUserId: session.user.id },
        { counselorId: session.user.id },
      ],
      status: { in: ["SCHEDULED", "IN_PROGRESS"] },
    },
    include: {
      neetUser: { select: { id: true, name: true, email: true, role: true } },
      counselor: { select: { id: true, name: true, email: true, role: true } },
      messages: {
        include: {
          sender: { select: { id: true, name: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
        take: 100,
      },
      sharedFiles: {
        include: {
          uploadedBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { scheduledAt: "desc" },
  });

  return (
    <CounselingPage
      session={counselingSession}
      currentUser={session.user}
      locale={locale}
    />
  );
}
