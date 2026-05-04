import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ModuleDetailPage from "@/components/ModuleDetailPage";

interface PageProps {
  params: { locale: string; moduleId: string };
}

export default async function ModuleDetail({ params: { locale, moduleId } }: PageProps) {
  const session = await auth();
  if (!session) redirect(`/${locale}/auth/login`);

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!module) notFound();

  const progress = await prisma.userModuleProgress.findUnique({
    where: { userId_moduleId: { userId: session.user.id, moduleId } },
  });

  return (
    <ModuleDetailPage
      module={module}
      lessons={module.lessons}
      status={progress?.status ?? "NOT_STARTED"}
      locale={locale}
    />
  );
}
