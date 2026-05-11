import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getUploadsDir } from "@/lib/uploads";

export async function GET(
  _: NextRequest,
  { params }: { params: { filename: string } }
) {
  const pdfsDir = path.join(getUploadsDir(), "pdfs");
  const filePath = path.join(pdfsDir, params.filename);

  if (!filePath.startsWith(pdfsDir)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
