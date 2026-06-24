import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { stageId: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stage = await prisma.counselingStage.findUnique({
    where: { id: params.stageId },
  });
  if (!stage) return NextResponse.json({ error: "Stage not found" }, { status: 404 });

  // Only the counselor for this pair can modify stages
  if (session.user.role !== "COUNSELOR" || stage.counselorId !== session.user.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();

  // Update summary
  if (typeof body.summary === "string") {
    const updated = await prisma.counselingStage.update({
      where: { id: params.stageId },
      data: { summary: body.summary },
    });
    return NextResponse.json({ stage: updated });
  }

  // Complete the stage and unlock the next one
  if (body.action === "complete") {
    if (stage.status !== "ACTIVE")
      return NextResponse.json({ error: "Only an active stage can be completed" }, { status: 400 });

    const [completed] = await prisma.$transaction([
      prisma.counselingStage.update({
        where: { id: params.stageId },
        data: { status: "COMPLETED" },
      }),
      prisma.counselingStage.updateMany({
        where: {
          neetUserId: stage.neetUserId,
          counselorId: stage.counselorId,
          number: stage.number + 1,
          status: "LOCKED",
        },
        data: { status: "ACTIVE" },
      }),
    ]);
    return NextResponse.json({ stage: completed });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
