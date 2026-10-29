import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CounsellorInviteForm from "@/components/CounsellorInviteForm";
import BrandMark from "@/components/BrandMark";
import FundingBanner from "@/components/FundingBanner";

interface PageProps {
  params: { locale: string; token: string };
}

export default async function InvitePage({ params: { locale, token } }: PageProps) {
  const session = await auth();
  if (session) redirect(`/${locale}/dashboard`);

  const t = await getTranslations({ locale, namespace: "invite" });

  // Validate the token server-side (same rules as GET /api/auth/invite/[token])
  const invite = await prisma.counsellorInvite.findUnique({
    where: { token },
    select: { email: true, used: true, expiresAt: true },
  });
  const error = !invite
    ? "Invalid invite link."
    : invite.used
      ? "This invite has already been used."
      : invite.expiresAt < new Date()
        ? "This invite link has expired."
        : null;

  if (!invite || error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-50 p-8">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">{t("invalidTitle")}</h2>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
        <FundingBanner className="w-full max-w-md" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f3d47] flex-col items-center p-12 text-white">
        <div className="flex w-full flex-1 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mb-8 flex flex-col items-center justify-center gap-4">
            <BrandMark className="h-36 w-36" rounded="rounded-3xl" />
            <span className="text-2xl font-bold tracking-wider">RURAL-CONNECT</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight">{t("brandWelcome")}</h2>
          <p className="text-slate-300 leading-relaxed">
            {t("brandDescription")}
          </p>
        </div>
        </div>
        <FundingBanner variant="panel" />
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <CounsellorInviteForm token={token} email={invite.email} locale={locale} />
        </div>
        <FundingBanner className="mt-8 w-full max-w-md lg:hidden" />
      </div>
    </div>
  );
}
