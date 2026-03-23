import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { notes, actionPlan } = await request.json();

  // Verify user is part of this session
  const counselingSession = await prisma.counselingSession.findFirst({
    where: {
      id: params.sessionId,
      OR: [
        { neetUserId: session.user.id },
        { counselorId: session.user.id },
      ],
    },
  });

  if (!counselingSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const updated = await prisma.counselingSession.update({
    where: { id: params.sessionId },
    data: { notes, actionPlan },
  });

  return NextResponse.json({ session: updated });
}
