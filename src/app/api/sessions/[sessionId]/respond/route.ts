import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { accept } = await request.json();

  const counselingSession = await prisma.counselingSession.findFirst({
    where: { id: params.sessionId, neetUserId: session.user.id, status: "PENDING" },
    include: {
      counselor: { select: { id: true, name: true } },
    },
  });

  if (!counselingSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const newStatus = accept ? "SCHEDULED" : "CANCELLED";

  const updated = await prisma.counselingSession.update({
    where: { id: params.sessionId },
    data: { status: newStatus },
  });

  const responseText = accept ? "accepted" : "declined";
  const notification = await prisma.notification.create({
    data: {
      userId: counselingSession.counselor.id,
      type: accept ? "SESSION_ACCEPTED" : "SESSION_DECLINED",
      title: `Session ${responseText}`,
      body: `${session.user.name} has ${responseText} your session invitation`,
      data: JSON.stringify({ sessionId: params.sessionId }),
    },
  });

  await pusherServer.trigger(
    `notifications-${counselingSession.counselor.id}`,
    "new-notification",
    notification
  );

  return NextResponse.json({ session: updated });
}
