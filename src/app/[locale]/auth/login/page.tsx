import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import LoginLanguageSelect from "@/components/LoginLanguageSelect";
import BrandMark from "@/components/BrandMark";
import FundingBanner from "@/components/FundingBanner";

interface LoginPageProps {
  params: { locale: string };
}

const COUNTRY_CODES = ["NO", "GR", "TR", "LV", "ES", "IT"] as const;
const COUNTRY_FLAGS: Record<string, string> = { NO: "🇳🇴", GR: "🇬🇷", TR: "🇹🇷", LV: "🇱🇻", ES: "🇪🇸", IT: "🇮🇹" };

export default async function LoginPage({ params: { locale } }: LoginPageProps) {
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
            <BrandMark className="h-28 w-28" rounded="rounded-3xl" />
            <span className="text-2xl font-bold tracking-wider">
              RURAL-CONNECT
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight">
            {t("brandTagline")}
          </h2>
          <p className="mb-8 text-slate-300 leading-relaxed">
            {t("brandDescription")}
          </p>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="rounded-xl bg-slate-700/50 p-4">
              <div className="text-2xl font-bold text-[#7fe0e6]">7</div>
              <div className="mt-1 text-xs text-slate-400">{t("statCountries")}</div>
            </div>
            <div className="rounded-xl bg-slate-700/50 p-4">
              <div className="text-2xl font-bold text-[#6fd3a6]">500+</div>
              <div className="mt-1 text-xs text-slate-400">{t("statUsersHelped")}</div>
            </div>
            <div className="rounded-xl bg-slate-700/50 p-4">
              <div className="text-2xl font-bold text-[#fbbc04]">24/7</div>
              <div className="mt-1 text-xs text-slate-400">{t("statSupport")}</div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
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

      {/* Right panel - login form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-end">
            <LoginLanguageSelect locale={locale} />
          </div>
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandMark className="h-12 w-12" rounded="rounded-xl" />
            <span className="text-xl font-bold tracking-wider text-[#0f3d47]">
              RURAL-CONNECT
            </span>
          </div>
          <LoginForm locale={locale} />
        </div>
        <FundingBanner className="mt-8 w-full max-w-md lg:hidden" />
      </div>
    </div>
  );
}
