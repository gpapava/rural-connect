import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["en", "tr", "lv", "el", "es", "it", "no"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  lv: "Latviešu",
  el: "Ελληνικά",
  es: "Español",
  it: "Italiano",
  no: "Norsk",
};

// BCP-47 tags for Intl formatting (the locale codes above are not all valid tags on their own).
export const localeTags: Record<Locale, string> = {
  en: "en-GB",
  tr: "tr-TR",
  lv: "lv-LV",
  el: "el-GR",
  es: "es-ES",
  it: "it-IT",
  no: "nb-NO",
};

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
