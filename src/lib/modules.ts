import { prisma } from "@/lib/prisma";
import { defaultLocale } from "@/i18n";

/**
 * Curriculum modules carry a `language` tag. A learner should see the modules
 * authored in their UI language; if none exist yet for that language we fall
 * back to the default-locale (English) set so users of not-yet-translated
 * locales still have content.
 */
export async function resolveModuleLanguage(locale: string): Promise<string> {
  const count = await prisma.module.count({ where: { language: locale } });
  return count > 0 ? locale : defaultLocale;
}
