import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminJobsPage from "@/components/AdminJobsPage";

interface PageProps {
  params: { locale: string };
}

export default async function AdminJobs({ params: { locale } }: PageProps) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect(`/${locale}/dashboard`);

  const jobs = await prisma.jobOpening.findMany({ orderBy: { createdAt: "desc" } });

  return <AdminJobsPage jobs={jobs} />;
}
