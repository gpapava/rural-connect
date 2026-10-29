"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { locales, localeNames, type Locale } from "@/i18n";

interface LoginLanguageSelectProps {
  locale: string;
  path?: string;
}

export default function LoginLanguageSelect({
  locale,
  path = "/auth/login",
}: LoginLanguageSelectProps) {
  const router = useRouter();
  const t = useTranslations("auth");

  return (
    <div className="flex flex-col items-end gap-1.5">
      <label
        htmlFor="login-language"
        className="text-sm font-semibold uppercase tracking-wide text-gray-800"
      >
        {t("chooseLanguage")}
      </label>
      <div className="relative inline-flex items-center">
        <Globe className="pointer-events-none absolute left-3.5 h-5 w-5 text-[#178593]" />
        <select
          id="login-language"
          value={locale}
          onChange={(e) => router.push(`/${e.target.value}${path}`)}
          className="appearance-none rounded-lg border-2 border-[#178593]/40 bg-white py-2.5 pl-11 pr-10 text-base font-medium text-gray-900 hover:border-[#178593] focus:border-[#178593] focus:outline-none focus:ring-2 focus:ring-[#178593]/25"
        >
          {locales.map((loc) => (
            <option key={loc} value={loc}>
              {localeNames[loc as Locale]}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 h-5 w-5 text-[#178593]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
