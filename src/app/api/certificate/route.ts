import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/certificate  — counsellor issues certificate after confirming all stages done
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "COUNSELOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { neetUserId } = await req.json();
  if (!neetUserId) return NextResponse.json({ error: "Missing neetUserId" }, { status: 400 });

  const counselorId = session.user.id;

  // Verify all 5 stages are COMPLETED for this pair
  const stages = await prisma.counselingStage.findMany({
    where: { neetUserId, counselorId },
  });

  if (stages.length !== 5 || stages.some((s) => s.status !== "COMPLETED")) {
    return NextResponse.json(
      { error: "All 5 stages must be completed before issuing a certificate" },
      { status: 400 }
    );
  }

  // Upsert certificate (idempotent)
  const cert = await prisma.certificate.upsert({
    where: { neetUserId },
    update: { counselorId, issuedAt: new Date() },
    create: { neetUserId, counselorId },
  });

  // Notify the NEET user
  await prisma.notification.create({
    data: {
      userId: neetUserId,
      type: "CERTIFICATE_ISSUED",
      title: "Certificate of Attendance Ready",
      body: "Your counsellor has approved your Certificate of Attendance. You can now download it from the Counselling page.",
      data: JSON.stringify({ certificateId: cert.id }),
    },
  });

  return NextResponse.json(cert, { status: 201 });
}
