import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getUploadsDir } from "@/lib/uploads";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm":  "text/html; charset=utf-8",
  ".js":   "application/javascript",
  ".mjs":  "application/javascript",
  ".css":  "text/css",
  ".json": "application/json",
  ".xml":  "application/xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".mp4":  "video/mp4",
  ".mp3":  "audio/mpeg",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".pdf":  "application/pdf",
  ".swf":  "application/x-shockwave-flash",
  ".zip":  "application/zip",
};

export async function GET(
  _: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const scormBase = path.join(getUploadsDir(), "scorm");
  const filePath = path.join(scormBase, ...params.path);

  if (!filePath.startsWith(scormBase)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const buffer = fs.readFileSync(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
