import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, email, password, country, language, neetDeclaration, gdprConsent } = await req.json();

  if (!name?.trim() || !email?.trim() || !password?.trim())
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });

  if (!neetDeclaration)
    return NextResponse.json({ error: "You must confirm that you are a NEET from a rural area." }, { status: 400 });

  if (!gdprConsent)
    return NextResponse.json({ error: "You must accept the data processing consent to register." }, { status: 400 });

  if (password.length < 8)
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (existing)
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: "NEET_USER",
      country: country?.trim() || null,
      language: language || "en",
      neetDeclaration: true,
      gdprConsent: true,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
