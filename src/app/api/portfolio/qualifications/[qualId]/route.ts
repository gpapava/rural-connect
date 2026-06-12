import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: { qualId: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify the qualification belongs to this user
  const qual = await prisma.qualification.findFirst({
    where: { id: params.qualId, portfolio: { userId: session.user.id } },
  });

  if (!qual) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.qualification.delete({ where: { id: params.qualId } });

  return NextResponse.json({ ok: true });
}
