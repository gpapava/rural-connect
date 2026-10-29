import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAdminStats, statsToCsv } from "@/lib/adminStats";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const csv = statsToCsv(await getAdminStats());
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rural-connect-stats-${date}.csv"`,
    },
  });
}
