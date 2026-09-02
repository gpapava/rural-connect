import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { locales, type Locale } from "@/i18n";
import { auth } from "@/lib/auth";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

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
            <div className="flex h-screen overflow-hidden bg-gray-50">
              <Sidebar locale={locale} user={session.user} />
              <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar locale={locale} user={session.user} />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
              </div>
            </div>
          ) : (
            <div className="min-h-screen bg-gray-50">{children}</div>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
