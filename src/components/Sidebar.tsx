"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  BookOpen,
  Briefcase,
  ChevronDown,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { locales, localeNames, type Locale } from "@/i18n";
import { UserRole } from "@prisma/client";

interface SidebarProps {
  locale: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

const navItems = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["NEET_USER", "COUNSELOR", "ADMIN"],
  },
  {
    key: "counseling",
    href: "/counseling",
    icon: MessageSquare,
    roles: ["NEET_USER", "COUNSELOR", "ADMIN"],
  },
  {
    key: "portfolio",
    href: "/portfolio",
    icon: FolderOpen,
    roles: ["NEET_USER", "COUNSELOR", "ADMIN"],
  },
  {
    key: "library",
    href: "/library",
    icon: BookOpen,
    roles: ["NEET_USER", "COUNSELOR", "ADMIN"],
  },
  {
    key: "laborMarket",
    href: "/labor-market",
    icon: Briefcase,
    roles: ["NEET_USER", "COUNSELOR", "ADMIN"],
  },
];

export default function Sidebar({ locale, user }: SidebarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getRoleBadge = (role: UserRole) => {
    const map: Record<UserRole, { label: string; color: string }> = {
      NEET_USER: { label: "NEET User", color: "bg-blue-500/20 text-blue-300" },
      COUNSELOR: { label: "Counselor", color: "bg-green-500/20 text-green-300" },
      ADMIN: { label: "Admin", color: "bg-purple-500/20 text-purple-300" },
    };
    return map[role];
  };

  const roleBadge = getRoleBadge(user.role);

  return (
    <aside className="flex h-full w-64 flex-col bg-[#1e293b] text-white shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-700/50 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a73e8]">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
            />
          </svg>
        </div>
        <span className="text-sm font-bold tracking-widest text-white">
          RURAL-CONNECT
        </span>
      </div>

      {/* User info */}
      <div className="border-b border-slate-700/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a73e8] text-sm font-semibold text-white">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {user.name}
            </p>
            <span
              className={cn(
                "inline-flex rounded-full px-1.5 py-0.5 text-xs font-medium",
                roleBadge.color
              )}
            >
              {roleBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems
          .filter((item) => item.roles.includes(user.role))
          .map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className={cn(
                  "sidebar-link",
                  active && "sidebar-link-active"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{t(item.key)}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1a73e8]" />
                )}
              </Link>
            );
          })}
      </nav>

      {/* Language selector */}
      <div className="border-t border-slate-700/50 px-3 py-4">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-[#273549] hover:text-white"
          >
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-left">
              {localeNames[locale as Locale]}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 flex-shrink-0 transition-transform",
                langOpen && "rotate-180"
              )}
            />
          </button>

          {langOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-full rounded-lg border border-slate-700 bg-[#1a2640] py-1 shadow-lg">
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={`/${loc}${pathname.replace(`/${locale}`, "")}`}
                  onClick={() => setLangOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[#273549]",
                    loc === locale
                      ? "font-medium text-[#1a73e8]"
                      : "text-slate-300"
                  )}
                >
                  <span className="uppercase text-xs font-bold opacity-60">
                    {loc}
                  </span>
                  <span>{localeNames[loc]}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
