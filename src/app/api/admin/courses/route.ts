import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { lessons: true } } },
  });

  return NextResponse.json({ modules });
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, description, category, duration } = await request.json();
  if (!title?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "title and description required" }, { status: 400 });
  }

  const last = await prisma.module.findFirst({ orderBy: { order: "desc" } });

  const module = await prisma.module.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      category: category?.trim() || "general",
      duration: duration ? parseInt(duration) : null,
      order: (last?.order ?? 0) + 1,
    },
  });

  return NextResponse.json({ module }, { status: 201 });
}
