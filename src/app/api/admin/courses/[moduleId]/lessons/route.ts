import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LessonType } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET(_: NextRequest, { params }: { params: { moduleId: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const lessons = await prisma.moduleLesson.findMany({
    where: { moduleId: params.moduleId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ lessons });
}

export async function POST(request: NextRequest, { params }: { params: { moduleId: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, type, content } = await request.json();
  if (!title?.trim() || !type || !content?.trim()) {
    return NextResponse.json({ error: "title, type and content required" }, { status: 400 });
  }

  const last = await prisma.moduleLesson.findFirst({
    where: { moduleId: params.moduleId },
    orderBy: { order: "desc" },
  });

  const lesson = await prisma.moduleLesson.create({
    data: {
      moduleId: params.moduleId,
      title: title.trim(),
      type: type as LessonType,
      content: content.trim(),
      order: (last?.order ?? 0) + 1,
    },
  });

  return NextResponse.json({ lesson }, { status: 201 });
}
