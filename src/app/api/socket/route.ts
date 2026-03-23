import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// This route handles Socket.io HTTP polling when used with Next.js API routes.
// For production, a separate Socket.io server (server.ts) is recommended.

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: { sessionId },
    include: {
      sender: {
        select: { id: true, name: true, role: true },
      },
    },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { sessionId, content } = body;

  if (!sessionId || !content?.trim()) {
    return NextResponse.json(
      { error: "sessionId and content required" },
      { status: 400 }
    );
  }

  const message = await prisma.message.create({
    data: {
      sessionId,
      senderId: session.user.id,
      content: content.trim(),
    },
    include: {
      sender: {
        select: { id: true, name: true, role: true },
      },
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
