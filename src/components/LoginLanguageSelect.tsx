"use client";

import { useRouter } from "next/navigation";
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

  return (
    <div className="relative inline-flex items-center">
      <Globe className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400" />
      <select
        aria-label="Language"
        value={locale}
        onChange={(e) => router.push(`/${e.target.value}${path}`)}
        className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm text-gray-700 hover:border-gray-300 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc as Locale]}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 h-4 w-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
