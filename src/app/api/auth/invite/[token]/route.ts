import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const invite = await prisma.counsellorInvite.findUnique({
    where: { token: params.token },
    select: { id: true, email: true, used: true, expiresAt: true },
  });

  if (!invite) return NextResponse.json({ error: "Invalid invite link." }, { status: 404 });
  if (invite.used) return NextResponse.json({ error: "This invite has already been used." }, { status: 410 });
  if (invite.expiresAt < new Date()) return NextResponse.json({ error: "This invite link has expired." }, { status: 410 });

  return NextResponse.json({ email: invite.email });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const invite = await prisma.counsellorInvite.findUnique({
    where: { token: params.token },
  });

  if (!invite) return NextResponse.json({ error: "Invalid invite link." }, { status: 404 });
  if (invite.used) return NextResponse.json({ error: "This invite has already been used." }, { status: 410 });
  if (invite.expiresAt < new Date()) return NextResponse.json({ error: "This invite link has expired." }, { status: 410 });

  const { name, password } = await req.json();

  if (!name?.trim() || !password?.trim())
    return NextResponse.json({ error: "Name and password are required." }, { status: 400 });

  if (password.length < 8)
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: invite.email } });
  if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        name: name.trim(),
        email: invite.email,
        passwordHash,
        role: "COUNSELOR",
        gdprConsent: true,
      },
      select: { id: true, name: true, email: true, role: true },
    });
    await tx.counsellorInvite.update({
      where: { id: invite.id },
      data: { used: true },
    });
    return created;
  });

  return NextResponse.json({ user }, { status: 201 });
}
