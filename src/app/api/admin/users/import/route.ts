import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  IMPORT_LANGUAGES,
  MAX_IMPORT_ROWS,
  mapRows,
  readRows,
  type ImportIssue,
} from "@/lib/neetImport";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

/**
 * Bulk-register NEET users from an .xlsx / .csv file (e.g. a Google Form export).
 * Every imported user gets the same one-time password (hashed once) and
 * `mustChangePassword = true`, so they are forced to choose their own password
 * — and accept the NEET declaration / GDPR consent — on first login.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const oneTimePassword = String(form.get("oneTimePassword") ?? "");
  const defaultLanguageRaw = String(form.get("defaultLanguage") ?? "en");
  const defaultLanguage = (IMPORT_LANGUAGES as readonly string[]).includes(defaultLanguageRaw)
    ? defaultLanguageRaw
    : "en";
  const defaultCountry = String(form.get("defaultCountry") ?? "").trim().toUpperCase() || null;

  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (file.size > MAX_FILE_BYTES)
    return NextResponse.json({ error: "File is too large (max 2 MB)." }, { status: 400 });
  if (oneTimePassword.length < 8)
    return NextResponse.json({ error: "The one-time password must be at least 8 characters." }, { status: 400 });

  let rows: string[][];
  try {
    rows = await readRows(file.name, Buffer.from(await file.arrayBuffer()));
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not read the file." },
      { status: 400 }
    );
  }

  const { items, issues } = mapRows(rows);
  if (items.length === 0)
    return NextResponse.json(
      { error: "No valid rows found.", issues },
      { status: 400 }
    );
  if (items.length > MAX_IMPORT_ROWS)
    return NextResponse.json(
      { error: `Too many rows (max ${MAX_IMPORT_ROWS} per import).` },
      { status: 400 }
    );

  const existing = await prisma.user.findMany({
    where: { email: { in: items.map((i) => i.email) } },
    select: { email: true },
  });
  const existingSet = new Set(existing.map((u) => u.email));
  const toCreate = items.filter((i) => !existingSet.has(i.email));
  const skipped: ImportIssue[] = items
    .filter((i) => existingSet.has(i.email))
    .map((i) => ({ line: i.line, email: i.email, reason: "An account with this email already exists." }));

  const passwordHash = await bcrypt.hash(oneTimePassword, 12);

  const result = await prisma.user.createMany({
    data: toCreate.map((i) => ({
      name: i.name,
      email: i.email,
      passwordHash,
      role: "NEET_USER" as const,
      country: i.country ?? defaultCountry,
      language: i.language ?? defaultLanguage,
      neetDeclaration: false,
      gdprConsent: false,
      mustChangePassword: true,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({
    created: result.count,
    skipped,
    invalid: issues,
  });
}
