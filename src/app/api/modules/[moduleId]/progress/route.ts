import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Records a NEET's module progress.
 * - no body / no lessonId: the learner opened the module → IN_PROGRESS (never downgrades).
 * - { lessonId }: the learner finished that lesson; once every lesson of the module is
 *   finished the module becomes COMPLETED.
 */
export async function POST(req: NextRequest, { params }: { params: { moduleId: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Only learners are tracked; counsellors/admins previewing content are not counted.
  if (session.user.role !== "NEET_USER") return NextResponse.json({ tracked: false });

  const userId = session.user.id;
  const { moduleId } = params;
  const body = await req.json().catch(() => ({}));
  const lessonId: string | undefined = typeof body?.lessonId === "string" ? body.lessonId : undefined;

  const lessons = await prisma.moduleLesson.findMany({ where: { moduleId }, select: { id: true } });
  if (lessons.length === 0) return NextResponse.json({ error: "Module not found" }, { status: 404 });

  const existing = await prisma.userModuleProgress.findUnique({
    where: { userId_moduleId: { userId, moduleId } },
  });
  if (existing?.status === "COMPLETED") return NextResponse.json({ status: "COMPLETED" });

  let status: "IN_PROGRESS" | "COMPLETED" = "IN_PROGRESS";
  if (lessonId) {
    if (!lessons.some((l) => l.id === lessonId))
      return NextResponse.json({ error: "Lesson not in module" }, { status: 400 });
    await prisma.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId },
      update: {},
    });
    const done = await prisma.userLessonProgress.count({
      where: { userId, lessonId: { in: lessons.map((l) => l.id) } },
    });
    if (done >= lessons.length) status = "COMPLETED";
  }

  await prisma.userModuleProgress.upsert({
    where: { userId_moduleId: { userId, moduleId } },
    create: { userId, moduleId, status, completedAt: status === "COMPLETED" ? new Date() : null },
    update: { status, completedAt: status === "COMPLETED" ? new Date() : null },
  });

  return NextResponse.json({ status });
}
