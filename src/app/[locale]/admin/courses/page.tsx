import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminCoursesPage from "@/components/AdminCoursesPage";

export default async function AdminCourses({ params: { locale } }: { params: { locale: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect(`/${locale}/dashboard`);

  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { lessons: true } } },
  });

  return <AdminCoursesPage modules={modules} locale={locale} />;
}
