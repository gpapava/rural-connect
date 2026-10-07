import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import LoginLanguageSelect from "@/components/LoginLanguageSelect";

interface ChangePasswordPageProps {
  params: { locale: string };
}

export default async function ChangePasswordPage({
  params: { locale },
}: ChangePasswordPageProps) {
  const session = await auth();

  if (!session) redirect(`/${locale}/auth/login`);
  if (!session.user.mustChangePassword) redirect(`/${locale}/dashboard`);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-3">
          <span className="text-lg font-bold tracking-wider text-[#1e293b]">
            RURAL-CONNECT
          </span>
          <LoginLanguageSelect locale={locale} path="/auth/change-password" />
        </div>
        <ChangePasswordForm locale={locale} email={session.user.email} />
      </div>
    </div>
  );
}
