import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: { userId: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (params.userId === session.user.id)
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });

  await prisma.user.delete({ where: { id: params.userId } });

  return NextResponse.json({ ok: true });
}
