import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateStages } from "@/lib/stages";
import CounselingPage from "@/components/CounselingPage";

interface PageProps {
  params: { locale: string };
}

export default async function Counseling({ params: { locale } }: PageProps) {
  const session = await auth();
  if (!session) redirect(`/${locale}/auth/login`);

  // Find the most recent counseling pair for this user
  const anySession = await prisma.counselingSession.findFirst({
    where: {
      OR: [{ neetUserId: session.user.id }, { counselorId: session.user.id }],
    },
    select: { neetUserId: true, counselorId: true },
    orderBy: { createdAt: "desc" },
  });

  if (!anySession) {
    return (
      <CounselingPage
        stages={[]}
        neetUser={null}
        counselor={null}
        currentUser={session.user}
        locale={locale}
        certificate={null}
      />
    );
  }

  const { neetUserId, counselorId } = anySession;

  // Get or create all 5 stages for this pair, fetch sessions and certificate in parallel
  const [stageRows, allSessions, neetUser, counselor, certificate] = await Promise.all([
    getOrCreateStages(neetUserId, counselorId),
    prisma.counselingSession.findMany({
      where: { neetUserId, counselorId },
      include: {
        messages: {
          include: { sender: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
        sharedFiles: {
          include: { uploadedBy: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.user.findUnique({
      where: { id: neetUserId },
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.user.findUnique({
      where: { id: counselorId },
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.certificate.findUnique({
      where: { neetUserId },
      select: { id: true, issuedAt: true },
    }),
  ]);

  // Attach sessions to their stage (sessions without a stageId fall into stage 1)
  const stages = stageRows.map((stage) => ({
    ...stage,
    sessions: allSessions.filter(
      (s) => s.stageId === stage.id || (stage.number === 1 && s.stageId === null)
    ),
  }));

  return (
    <CounselingPage
      stages={stages}
      neetUser={neetUser}
      counselor={counselor}
      currentUser={session.user}
      locale={locale}
      certificate={certificate}
    />
  );
}
