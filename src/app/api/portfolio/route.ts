import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portfolio = await prisma.portfolioEntry.findUnique({
    where: { userId: session.user.id },
    include: { qualifications: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json({ portfolio });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    summary,
    targetSector,
    neetStatus,
    skills,
    contactPhone,
    contactAddress,
    linkedinUrl,
  } = body;

  const portfolio = await prisma.portfolioEntry.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      summary,
      targetSector,
      neetStatus,
      skills,
      contactPhone,
      contactAddress,
      linkedinUrl,
    },
    update: {
      summary,
      targetSector,
      neetStatus,
      skills,
      contactPhone,
      contactAddress,
      linkedinUrl,
    },
  });

  return NextResponse.json({ portfolio });
}
