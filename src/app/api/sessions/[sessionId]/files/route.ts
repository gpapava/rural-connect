import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs";
import { getUploadsDir } from "@/lib/uploads";

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const counselingSession = await prisma.counselingSession.findFirst({
    where: {
      id: params.sessionId,
      OR: [
        { neetUserId: session.user.id },
        { counselorId: session.user.id },
      ],
    },
  });

  if (!counselingSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const fileName = `${Date.now()}-${safeName}`;

  const filesDir = path.join(getUploadsDir(), "session-files");
  fs.mkdirSync(filesDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(filesDir, fileName), buffer);

  const sharedFile = await prisma.sharedFile.create({
    data: {
      sessionId: params.sessionId,
      uploadedById: session.user.id,
      fileName: file.name,
      fileUrl: `/api/uploads/session-files/${fileName}`,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream",
    },
    include: {
      uploadedBy: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ file: sharedFile }, { status: 201 });
}
