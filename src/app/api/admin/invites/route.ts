import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invites = await prisma.counsellorInvite.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, token: true, used: true, expiresAt: true, createdAt: true },
  });

  return NextResponse.json({ invites });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await req.json();
  if (!email?.trim())
    return NextResponse.json({ error: "Email is required." }, { status: 400 });

  const emailLower = email.trim().toLowerCase();

  // Check if a user with this email already exists
  const existing = await prisma.user.findUnique({ where: { email: emailLower } });
  if (existing)
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });

  // Delete any previous unused invite for the same email
  await prisma.counsellorInvite.deleteMany({ where: { email: emailLower, used: false } });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invite = await prisma.counsellorInvite.create({
    data: { email: emailLower, createdBy: session.user.id, expiresAt },
    select: { id: true, email: true, token: true, used: true, expiresAt: true, createdAt: true },
  });

  return NextResponse.json({ invite }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.counsellorInvite.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
