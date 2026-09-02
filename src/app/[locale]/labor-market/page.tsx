import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LaborMarketPage from "@/components/LaborMarketPage";

interface PageProps {
  params: { locale: string };
}

export default async function LaborMarket({ params: { locale } }: PageProps) {
  const session = await auth();
  if (!session) redirect(`/${locale}/auth/login`);

  const [links, jobs, videos] = await Promise.all([
    prisma.laborMarketLink.findMany({ orderBy: [{ country: "asc" }, { agencyName: "asc" }] }),
    prisma.jobOpening.findMany({ where: { status: "APPROVED" }, orderBy: { createdAt: "desc" } }),
    prisma.laborMarketVideo.findMany({ orderBy: [{ language: "asc" }, { order: "asc" }, { createdAt: "asc" }] }),
  ]);

  return <LaborMarketPage links={links} jobs={jobs} videos={videos} locale={locale} />;
}
