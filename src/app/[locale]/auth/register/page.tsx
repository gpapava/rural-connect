import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import RegisterForm from "@/components/RegisterForm";
import BrandMark from "@/components/BrandMark";
import FundingBanner from "@/components/FundingBanner";

interface RegisterPageProps {
  params: { locale: string };
}

const COUNTRY_CODES = ["NO", "GR", "TR", "LV", "ES", "IT"] as const;
const COUNTRY_FLAGS: Record<string, string> = { NO: "🇳🇴", GR: "🇬🇷", TR: "🇹🇷", LV: "🇱🇻", ES: "🇪🇸", IT: "🇮🇹" };

export default async function RegisterPage({ params: { locale } }: RegisterPageProps) {
  const session = await auth();

  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  const t = await getTranslations({ locale, namespace: "auth" });
  const tc = await getTranslations({ locale, namespace: "common.countries" });

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f3d47] flex-col items-center p-12 text-white">
        <div className="flex w-full flex-1 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mb-8 flex flex-col items-center justify-center gap-4">
            <BrandMark className="h-36 w-36" rounded="rounded-3xl" />
            <span className="text-2xl font-bold tracking-wider">RURAL-CONNECT</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight">{t("registerBrandTitle")}</h2>
          <p className="mb-8 text-slate-300 leading-relaxed">
            {t("registerBrandDescription")}
          </p>
          <div className="rounded-xl bg-slate-700/50 p-6 text-left space-y-3">
            {[
              t("benefitCounseling"),
              t("benefitElearning"),
              t("benefitPortfolio"),
              t("benefitJobs"),
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2f9e77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {COUNTRY_CODES.map((code) => (
              <span
                key={code}
                className="rounded-full bg-slate-700/50 px-3 py-1 text-xs text-slate-300"
              >
                {COUNTRY_FLAGS[code]} {tc(code)}
              </span>
            ))}
          </div>
        </div>
        </div>
        <FundingBanner variant="panel" />
      </div>

      {/* Right panel - register form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandMark className="h-12 w-12" rounded="rounded-xl" />
            <span className="text-xl font-bold tracking-wider text-[#0f3d47]">RURAL-CONNECT</span>
          </div>
          <RegisterForm locale={locale} />
        </div>
        <FundingBanner className="mt-8 w-full max-w-md lg:hidden" />
      </div>
    </div>
  );
}
