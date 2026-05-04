import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId, isTyping } = await request.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const event = isTyping ? "user-typing" : "user-stopped-typing";
  await pusherServer.trigger(`session-${sessionId}`, event, {
    userId: session.user.id,
    name: session.user.name,
  });

  return NextResponse.json({ ok: true });
}
