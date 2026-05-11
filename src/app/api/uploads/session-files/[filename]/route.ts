import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs";
import { getUploadsDir } from "@/lib/uploads";

export async function GET(
  _: NextRequest,
  { params }: { params: { filename: string } }
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const filesDir = path.join(getUploadsDir(), "session-files");
  const filePath = path.join(filesDir, params.filename);

  if (!filePath.startsWith(filesDir)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(params.filename).toLowerCase();
  const mime: Record<string, string> = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".txt": "text/plain",
    ".zip": "application/zip",
  };

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mime[ext] ?? "application/octet-stream",
      "Content-Disposition": `inline; filename="${params.filename}"`,
    },
  });
}
