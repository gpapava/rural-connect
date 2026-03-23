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

  const links = await prisma.laborMarketLink.findMany({
    orderBy: [{ country: "asc" }, { agencyName: "asc" }],
  });

  return <LaborMarketPage links={links} locale={locale} />;
}
