import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

interface PageProps {
  params: { locale: string };
}

export default async function RootPage({ params: { locale } }: PageProps) {
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  redirect(`/${locale}/dashboard`);
}
