import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, country: true, language: true, createdAt: true },
  });

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, password, role, country, language } = await req.json();

  if (!name?.trim() || !email?.trim() || !password?.trim() || !role)
    return NextResponse.json({ error: "Name, email, password and role are required." }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name: name.trim(), email: email.trim().toLowerCase(), passwordHash, role, country: country?.trim() || null, language: language || "en" },
    select: { id: true, name: true, email: true, role: true, country: true, language: true, createdAt: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
