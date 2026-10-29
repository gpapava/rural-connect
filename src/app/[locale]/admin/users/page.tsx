import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminUsersPage from "@/components/AdminUsersPage";
import { getCounsellingProgress } from "@/lib/counsellingProgress";

export default async function AdminUsers({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect(`/${locale}/dashboard`);

  const [rows, progress] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, country: true, language: true, createdAt: true, lastLoginAt: true },
    }),
    getCounsellingProgress(),
  ]);
  const users = rows.map((u) => ({
    ...u,
    counselling:
      u.role === "NEET_USER"
        ? progress[u.id] ?? { counselor: null, stagesCompleted: 0, certificate: false, status: "none" as const }
        : null,
  }));

  return <AdminUsersPage users={users} currentUserId={session.user.id} />;
}
