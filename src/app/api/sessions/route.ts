import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "COUNSELOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { neetUserId, scheduledAt, note } = await request.json();

  if (!neetUserId || !scheduledAt) {
    return NextResponse.json({ error: "neetUserId and scheduledAt are required" }, { status: 400 });
  }

  const neetUser = await prisma.user.findUnique({
    where: { id: neetUserId, role: "NEET_USER" },
    select: { id: true, name: true },
  });

  if (!neetUser) {
    return NextResponse.json({ error: "NEET user not found" }, { status: 404 });
  }

  const counselingSession = await prisma.counselingSession.create({
    data: {
      counselorId: session.user.id,
      neetUserId,
      scheduledAt: new Date(scheduledAt),
      notes: note ?? null,
      status: "PENDING",
    },
  });

  const scheduledDate = new Date(scheduledAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const notification = await prisma.notification.create({
    data: {
      userId: neetUserId,
      type: "SESSION_INVITE",
      title: "New session invitation",
      body: `${session.user.name} has scheduled a video session with you on ${scheduledDate}`,
      data: JSON.stringify({ sessionId: counselingSession.id }),
    },
  });

  await pusherServer.trigger(`notifications-${neetUserId}`, "new-notification", notification);

  return NextResponse.json({ session: counselingSession }, { status: 201 });
}
