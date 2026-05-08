import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";

// Detect the SCORM launch file from imsmanifest.xml
function detectEntryPoint(zip: AdmZip, folderName: string): string | null {
  const manifest = zip.getEntry("imsmanifest.xml") ??
    zip.getEntries().find((e) => e.entryName.endsWith("imsmanifest.xml"));

  if (!manifest) return null;

  const xml = manifest.getData().toString("utf8");

  // The manifest's href values are relative to the manifest file itself.
  // If the manifest lives in a subdirectory (e.g. MyPkg/imsmanifest.xml),
  // we need to prefix detected hrefs so the URL resolves correctly.
  const manifestDir = path.posix.dirname(manifest.entryName.replace(/\\/g, "/"));
  const prefix = manifestDir === "." ? "" : manifestDir + "/";

  // Look for the SCO resource href
  const scoMatch = xml.match(
    /<resource[^>]+adlcp:scormtype\s*=\s*["']sco["'][^>]+href\s*=\s*["']([^"']+)["']/i
  ) ?? xml.match(
    /<resource[^>]+href\s*=\s*["']([^"']+)["'][^>]+adlcp:scormtype\s*=\s*["']sco["']/i
  );

  if (scoMatch) return prefix + scoMatch[1];

  // Fallback: first resource with an href
  const anyMatch = xml.match(/<resource[^>]+href\s*=\s*["']([^"'?#]+\.html?[^"']*)/i);
  if (anyMatch) return prefix + anyMatch[1];

  return null;
}

// Common SCORM entry point filenames to check if manifest detection fails
const COMMON_ENTRY_POINTS = [
  "index.html", "story.html", "launch.html", "default.html",
  "index_lms.html", "scormcontent/index.html",
];

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

  if (!file.name.endsWith(".zip")) {
    return NextResponse.json({ error: "File must be a .zip" }, { status: 400 });
  }

  // Sanitize folder name from zip filename
  const baseName = file.name.replace(/\.zip$/i, "").replace(/[^a-z0-9_-]/gi, "-").toLowerCase();
  const folderName = `${baseName}-${Date.now()}`;

  const scormRoot = path.join(process.cwd(), "public", "scorm", folderName);
  fs.mkdirSync(scormRoot, { recursive: true });

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);

    // Security: prevent path traversal
    for (const entry of zip.getEntries()) {
      const entryPath = path.join(scormRoot, entry.entryName);
      if (!entryPath.startsWith(scormRoot)) {
        return NextResponse.json({ error: "Invalid zip contents" }, { status: 400 });
      }
    }

    zip.extractAllTo(scormRoot, true);

    // Detect entry point
    let entryPoint = detectEntryPoint(zip, folderName);

    if (!entryPoint) {
      entryPoint = COMMON_ENTRY_POINTS.find((f) =>
        fs.existsSync(path.join(scormRoot, f))
      ) ?? null;
    }

    if (!entryPoint) {
      // Last resort: find first .html file
      const htmlFile = zip.getEntries().find((e) => /\.html?$/i.test(e.entryName) && !e.isDirectory);
      entryPoint = htmlFile?.entryName ?? null;
    }

    if (!entryPoint) {
      fs.rmSync(scormRoot, { recursive: true, force: true });
      return NextResponse.json({ error: "Could not detect SCORM entry point. Make sure the zip contains imsmanifest.xml." }, { status: 400 });
    }

    const launchUrl = `/scorm/${folderName}/${entryPoint}`;

    return NextResponse.json({ launchUrl, folderName });
  } catch (err) {
    fs.rmSync(scormRoot, { recursive: true, force: true });
    return NextResponse.json({ error: "Failed to extract zip file" }, { status: 500 });
  }
}
