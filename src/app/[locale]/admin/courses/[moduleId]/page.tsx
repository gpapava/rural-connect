import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminCourseEditPage from "@/components/AdminCourseEditPage";

export default async function AdminCourseEdit({
  params: { locale, moduleId },
}: {
  params: { locale: string; moduleId: string };
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect(`/${locale}/dashboard`);

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!module) redirect(`/${locale}/admin/courses`);

  return <AdminCourseEditPage module={module} locale={locale} />;
}
