import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAdminStats } from "@/lib/adminStats";
import AdminStatsPage from "@/components/AdminStatsPage";
import { getParticipants } from "@/lib/participants";

export const dynamic = "force-dynamic";

export default async function AdminStats({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect(`/${locale}/dashboard`);

  const [stats, participants] = await Promise.all([getAdminStats(), getParticipants()]);
  return <AdminStatsPage stats={stats} participants={participants} locale={locale} />;
}
