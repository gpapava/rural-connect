import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ScheduleSessionPage from "@/components/ScheduleSessionPage";

interface PageProps {
  params: { locale: string };
}

export default async function NewSessionPage({ params: { locale } }: PageProps) {
  const session = await auth();
  if (!session) redirect(`/${locale}/auth/login`);
  if (session.user.role !== "COUNSELOR") redirect(`/${locale}/dashboard`);

  return <ScheduleSessionPage locale={locale} />;
}
