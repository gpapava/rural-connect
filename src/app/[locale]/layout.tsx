import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { locales, type Locale } from "@/i18n";
import { auth } from "@/lib/auth";
import "../globals.css";
import AppShell from "@/components/AppShell";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: {
      default: "RURAL-CONNECT",
      template: "%s | RURAL-CONNECT",
    },
    description: t("description"),
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const session = await auth();

  // Determine if current path is an auth page
  const headersList = headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAuthPage = pathname.includes("/auth/");

  const showShell = session && !isAuthPage;

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {showShell ? (
            <AppShell locale={locale} user={session.user}>
              {children}
            </AppShell>
          ) : (
            <div className="min-h-screen bg-gray-50">{children}</div>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
