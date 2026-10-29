import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

const ROLES = ["ADMIN", "COUNSELOR", "NEET_USER"];

function cell(v: string | null): string {
  const s = v ?? "";
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV of the user list, optionally filtered by ?role=NEET_USER|COUNSELOR|ADMIN and/or ?country=GR. */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = req.nextUrl.searchParams.get("role");
  const country = req.nextUrl.searchParams.get("country");

  const users = await prisma.user.findMany({
    where: {
      ...(role && ROLES.includes(role) ? { role: role as UserRole } : {}),
      ...(country ? { country: country === "none" ? null : country } : {}),
    },
    orderBy: [{ country: "asc" }, { role: "asc" }, { name: "asc" }],
    select: { name: true, email: true, role: true, country: true, language: true, createdAt: true },
  });

  const rows = [["name", "email", "role", "country", "language", "registered"]].concat(
    users.map((u) => [u.name, u.email, u.role, u.country ?? "", u.language, u.createdAt.toISOString().slice(0, 10)])
  );
  const csv = "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rural-connect-users-${date}.csv"`,
    },
  });
}
