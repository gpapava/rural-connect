import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * First-login password change for bulk-imported NEET users
 * (`mustChangePassword = true`). Also records the NEET declaration and GDPR
 * consent that imported users did not give at registration.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { newPassword, neetDeclaration, gdprConsent } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.mustChangePassword)
    return NextResponse.json({ error: "No password change is required." }, { status: 400 });

  if (typeof newPassword !== "string" || newPassword.length < 8)
    return NextResponse.json({ error: "weak" }, { status: 400 });
  if (!neetDeclaration || !gdprConsent)
    return NextResponse.json({ error: "consent" }, { status: 400 });
  if (await bcrypt.compare(newPassword, user.passwordHash))
    return NextResponse.json({ error: "same" }, { status: 400 });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await bcrypt.hash(newPassword, 12),
      mustChangePassword: false,
      neetDeclaration: true,
      gdprConsent: true,
    },
  });

  return NextResponse.json({ ok: true });
}
