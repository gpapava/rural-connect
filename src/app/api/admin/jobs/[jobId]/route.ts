import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, adminNote } = await req.json();

  if (!["APPROVED", "REJECTED"].includes(status))
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  const job = await prisma.jobOpening.update({
    where: { id: params.jobId },
    data: { status, adminNote: adminNote?.trim() || null },
  });

  return NextResponse.json({ job });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.jobOpening.delete({ where: { id: params.jobId } });
  return NextResponse.json({ ok: true });
}
