import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { moduleId: string; topicId: string } }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title } = await request.json();
  if (!title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

  const topic = await prisma.topic.update({
    where: { id: params.topicId },
    data: { title: title.trim() },
  });

  return NextResponse.json({ topic });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { moduleId: string; topicId: string } }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Unassign lessons before deleting (belt-and-suspenders alongside DB SetNull)
  await prisma.moduleLesson.updateMany({
    where: { topicId: params.topicId },
    data: { topicId: null },
  });

  await prisma.topic.delete({ where: { id: params.topicId } });
  return NextResponse.json({ ok: true });
}
