"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Home, User, LogOut, ChevronDown, Menu } from "lucide-react";
import { UserRole } from "@prisma/client";
import { getInitials } from "@/lib/utils";
import NotificationBell from "@/components/NotificationBell";
import BrandMark from "@/components/BrandMark";

interface TopbarProps {
  locale: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  onMenuClick?: () => void;
}

export default function Topbar({ locale, user, onMenuClick }: TopbarProps) {
  const t = useTranslations("nav");
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}/auth/login` });
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-blue-700/30 bg-[#178593] px-4 shadow-md sm:px-6">
      {/* Left - Menu (mobile) + Logo/Brand */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={t("menu")}
          className="rounded-lg p-1.5 text-white transition-colors hover:bg-white/10 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href={`/${locale}/dashboard`}
          className="flex items-center gap-2 text-white"
        >
          <BrandMark className="h-8 w-8" rounded="rounded-lg" />
          <span className="text-sm font-bold tracking-widest text-white hidden sm:inline">
            RURAL-CONNECT
          </span>
        </Link>
      </div>

      {/* Center - Nav links */}
      <nav className="hidden md:flex items-center gap-1">
        <Link
          href={`/${locale}/dashboard`}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Home className="h-4 w-4" />
          {t("home")}
        </Link>
      </nav>

      {/* Right - User menu */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <NotificationBell userId={user.id} locale={locale} />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white transition-colors hover:bg-white/10"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white">
              {getInitials(user.name)}
            </div>
            <span className="hidden sm:inline font-medium">{user.name.split(" ")[0]}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Link
                  href={`/${locale}/portfolio`}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <User className="h-4 w-4 text-gray-400" />
                  {t("myProfile")}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
