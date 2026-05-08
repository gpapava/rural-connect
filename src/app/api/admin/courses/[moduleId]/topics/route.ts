import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET(_: NextRequest, { params }: { params: { moduleId: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const topics = await prisma.topic.findMany({
    where: { moduleId: params.moduleId },
    orderBy: { order: "asc" },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ topics });
}

export async function POST(request: NextRequest, { params }: { params: { moduleId: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, description } = await request.json();
  if (!title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

  const last = await prisma.topic.findFirst({
    where: { moduleId: params.moduleId },
    orderBy: { order: "desc" },
  });

  const topic = await prisma.topic.create({
    data: {
      moduleId: params.moduleId,
      title: title.trim(),
      description: description ?? null,
      order: (last?.order ?? 0) + 1,
    },
    include: { lessons: true },
  });

  return NextResponse.json({ topic }, { status: 201 });
}
