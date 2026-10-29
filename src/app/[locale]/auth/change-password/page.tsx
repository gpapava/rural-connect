import FundingBanner from "@/components/FundingBanner";
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-3">
          <span className="text-lg font-bold tracking-wider text-[#0f3d47]">
            RURAL-CONNECT
          </span>
          <LoginLanguageSelect locale={locale} path="/auth/change-password" />
        </div>
        <ChangePasswordForm locale={locale} email={session.user.email} />
      </div>
      <FundingBanner className="w-full max-w-md" />
    </div>
  );
}
