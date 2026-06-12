import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminUsersPage from "@/components/AdminUsersPage";

export default async function AdminUsers({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect(`/${locale}/dashboard`);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, country: true, language: true, createdAt: true },
  });

  return <AdminUsersPage users={users} currentUserId={session.user.id} />;
}
