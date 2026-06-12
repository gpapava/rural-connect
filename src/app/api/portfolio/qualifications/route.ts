import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, institution, status, completedAt } = await req.json();

  if (!title?.trim())
    return NextResponse.json({ error: "Title is required." }, { status: 400 });

  // Ensure portfolio exists first
  const portfolio = await prisma.portfolioEntry.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
  });

  const qualification = await prisma.qualification.create({
    data: {
      portfolioId: portfolio.id,
      title: title.trim(),
      institution: institution?.trim() || null,
      status: status || "completed",
      completedAt: completedAt ? new Date(completedAt) : null,
    },
  });

  return NextResponse.json({ qualification }, { status: 201 });
}
