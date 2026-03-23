import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { locales, type Locale } from "@/i18n";
import { auth } from "@/lib/auth";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: {
    default: "RURAL-CONNECT",
    template: "%s | RURAL-CONNECT",
  },
  description:
    "Empowering NEET youth in rural areas through digital counseling and skills development",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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
