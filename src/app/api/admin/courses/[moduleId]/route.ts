import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(request: NextRequest, { params }: { params: { moduleId: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, description, category, duration, imageUrl } = await request.json();

  const module = await prisma.module.update({
    where: { id: params.moduleId },
    data: {
      ...(title ? { title: title.trim() } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(category ? { category: category.trim() } : {}),
      duration: duration ? parseInt(duration) : null,
      imageUrl: imageUrl?.trim() || null,
    },
  });

  return NextResponse.json({ module });
}

export async function DELETE(_: NextRequest, { params }: { params: { moduleId: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.module.delete({ where: { id: params.moduleId } });
  return NextResponse.json({ ok: true });
}
