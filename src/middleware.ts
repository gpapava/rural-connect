import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { locales, defaultLocale } from "@/i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const protectedPathPrefixes = [
  "/dashboard",
  "/counseling",
  "/portfolio",
  "/library",
  "/labor-market",
];

const authPathPrefixes = ["/auth/login"];

function getPathnameWithoutLocale(pathname: string): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(`/${locale}`.length);
    }
    if (pathname === `/${locale}`) {
      return "/";
    }
  }
  return pathname;
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);
  const locale =
    locales.find((l) => pathname.startsWith(`/${l}`)) ?? defaultLocale;

  const isProtectedPath = protectedPathPrefixes.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );
  const isAuthPath = authPathPrefixes.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (isProtectedPath) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }
  }

  if (isAuthPath) {
    const session = await auth();
    if (session) {
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard`, request.url)
      );
    }
  }

  const response = intlMiddleware(request);

  // Pass pathname to layout via request header
  if (response instanceof NextResponse) {
    response.headers.set("x-pathname", pathname);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
