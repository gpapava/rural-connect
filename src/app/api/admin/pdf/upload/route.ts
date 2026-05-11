import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs";
import { getUploadsDir } from "@/lib/uploads";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
    return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
  }

  const safeName = file.name
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9_-]/gi, "-")
    .toLowerCase();
  const fileName = `${safeName}-${Date.now()}.pdf`;

  const pdfsDir = path.join(getUploadsDir(), "pdfs");
  fs.mkdirSync(pdfsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(pdfsDir, fileName), buffer);

  return NextResponse.json({ url: `/api/uploads/pdfs/${fileName}` });
}
