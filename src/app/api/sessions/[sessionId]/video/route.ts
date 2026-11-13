import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString("base64url");

function signJwt(payload: object, secret: string) {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

// Returns the URL for the Jitsi room of a counselling session.
// With JITSI_DOMAIN / JITSI_APP_ID / JITSI_APP_SECRET set, it points to our own
// Jitsi server and appends a short-lived JWT (only session participants get one).
// Without them it falls back to the public meet.jit.si (5-minute limit).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const authSession = await auth();
  if (!authSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await params;
  const cs = await prisma.counselingSession.findUnique({
    where: { id: sessionId },
    select: { id: true, neetUserId: true, counselorId: true, status: true },
  });

  const userId = authSession.user.id;
  if (!cs || (cs.neetUserId !== userId && cs.counselorId !== userId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (cs.status === "PENDING") {
    return NextResponse.json({ error: "Session not accepted yet" }, { status: 409 });
  }

  const room = `ruralconnect-${cs.id}`;
  const domain = process.env.JITSI_DOMAIN;
  const appId = process.env.JITSI_APP_ID;
  const secret = process.env.JITSI_APP_SECRET;

  if (!domain || !appId || !secret) {
    return NextResponse.json({ url: `https://meet.jit.si/${room}` });
  }

  const now = Math.floor(Date.now() / 1000);
  const isCounselor = cs.counselorId === userId;
  const jwt = signJwt(
    {
      aud: appId,
      iss: appId,
      sub: domain,
      room,
      iat: now,
      nbf: now - 10,
      exp: now + 4 * 60 * 60,
      context: {
        user: {
          id: userId,
          name: authSession.user.name ?? "Participant",
          moderator: isCounselor,
        },
      },
      moderator: isCounselor,
    },
    secret
  );

  return NextResponse.json({ url: `https://${domain}/${room}?jwt=${jwt}` });
}
