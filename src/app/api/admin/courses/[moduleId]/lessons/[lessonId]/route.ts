import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LessonType } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(request: NextRequest, { params }: { params: { moduleId: string; lessonId: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, type, content } = await request.json();

  const lesson = await prisma.moduleLesson.update({
    where: { id: params.lessonId },
    data: {
      ...(title && { title: title.trim() }),
      ...(type && { type: type as LessonType }),
      ...(content && { content: content.trim() }),
    },
  });

  return NextResponse.json({ lesson });
}

export async function DELETE(_: NextRequest, { params }: { params: { moduleId: string; lessonId: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.moduleLesson.delete({ where: { id: params.lessonId } });
  return NextResponse.json({ ok: true });
}
