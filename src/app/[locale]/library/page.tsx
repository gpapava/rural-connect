import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveModuleLanguage } from "@/lib/modules";
import LibraryPage from "@/components/LibraryPage";

interface PageProps {
  params: { locale: string };
}

export default async function Library({ params: { locale } }: PageProps) {
  const session = await auth();
  if (!session) redirect(`/${locale}/auth/login`);

  const language = await resolveModuleLanguage(locale);

  const [modules, userProgress] = await Promise.all([
    prisma.module.findMany({ where: { language }, orderBy: { order: "asc" } }),
    prisma.userModuleProgress.findMany({
      where: { userId: session.user.id },
    }),
  ]);

  const modulesWithProgress = modules.map((module) => {
    const progress = userProgress.find((p) => p.moduleId === module.id);
    return {
      ...module,
      status: progress?.status ?? "NOT_STARTED",
      completedAt: progress?.completedAt ?? null,
    };
  });

  return <LibraryPage modules={modulesWithProgress} locale={locale} />;
}
