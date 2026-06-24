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
      />
    );
  }

  const { neetUserId, counselorId } = anySession;

  // Get or create all 5 stages for this pair
  const stageRows = await getOrCreateStages(neetUserId, counselorId);

  // Fetch all sessions for this pair with messages and files
  const allSessions = await prisma.counselingSession.findMany({
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
  });

  // Attach sessions to their stage (sessions without a stageId fall into stage 1)
  const stage1Id = stageRows[0]?.id;
  const stages = stageRows.map((stage) => ({
    ...stage,
    sessions: allSessions.filter(
      (s) => s.stageId === stage.id || (stage.number === 1 && s.stageId === null)
    ),
  }));

  // Fetch the two users involved
  const [neetUser, counselor] = await Promise.all([
    prisma.user.findUnique({
      where: { id: neetUserId },
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.user.findUnique({
      where: { id: counselorId },
      select: { id: true, name: true, email: true, role: true },
    }),
  ]);

  return (
    <CounselingPage
      stages={stages}
      neetUser={neetUser}
      counselor={counselor}
      currentUser={session.user}
      locale={locale}
    />
  );
}
