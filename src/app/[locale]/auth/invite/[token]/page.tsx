import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import CounsellorInviteForm from "@/components/CounsellorInviteForm";

interface PageProps {
  params: { locale: string; token: string };
}

export default async function InvitePage({ params: { locale, token } }: PageProps) {
  const session = await auth();
  if (session) redirect(`/${locale}/dashboard`);

  const t = await getTranslations({ locale, namespace: "invite" });

  // Validate the token server-side
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/invite/${token}`,
    { cache: "no-store" }
  );
  const data = await res.json();

  if (!res.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">{t("invalidTitle")}</h2>
          <p className="text-sm text-gray-500">{data.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1e293b] flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#34a853]">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-wider">RURAL-CONNECT</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight">{t("brandWelcome")}</h2>
          <p className="text-slate-300 leading-relaxed">
            {t("brandDescription")}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <CounsellorInviteForm token={token} email={data.email} locale={locale} />
        </div>
      </div>
    </div>
  );
}
