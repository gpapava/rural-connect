import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "COUNSELOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const myStudents = searchParams.get("myStudents") === "true";

  if (myStudents) {
    // Only users who have had a session with this counselor
    const sessions = await prisma.counselingSession.findMany({
      where: { counselorId: session.user.id },
      select: { neetUser: { select: { id: true, name: true, email: true, country: true } } },
      distinct: ["neetUserId"],
    });
    const users = sessions.map((s) => s.neetUser);
    return NextResponse.json({ users });
  }

  const users = await prisma.user.findMany({
    where: { role: "NEET_USER" },
    select: { id: true, name: true, email: true, country: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ users });
}
