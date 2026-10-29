import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAdminStats } from "@/lib/adminStats";
import AdminStatsPage from "@/components/AdminStatsPage";

export const dynamic = "force-dynamic";

export default async function AdminStats({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect(`/${locale}/dashboard`);

  const stats = await getAdminStats();
  return <AdminStatsPage stats={stats} locale={locale} />;
}
