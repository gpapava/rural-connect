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
  ShieldCheck,
  CalendarPlus,
  Users,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { locales, localeNames, type Locale } from "@/i18n";
import { UserRole } from "@prisma/client";
import BrandMark from "@/components/BrandMark";

interface SidebarProps {
  locale: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  /** Mobile drawer state (ignored from the lg breakpoint up, where the sidebar is always visible). */
  open?: boolean;
  onClose?: () => void;
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
  {
    key: "scheduleSession",
    href: "/sessions/new",
    icon: CalendarPlus,
    roles: ["COUNSELOR"],
  },
  {
    key: "admin",
    href: "/admin/courses",
    icon: ShieldCheck,
    roles: ["ADMIN"],
  },
  {
    key: "adminUsers",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    key: "adminJobs",
    href: "/admin/jobs",
    icon: Briefcase,
    roles: ["ADMIN"],
  },
  {
    key: "adminStats",
    href: "/admin/stats",
    icon: BarChart3,
    roles: ["ADMIN"],
  },
];

export default function Sidebar({ locale, user, open = false, onClose }: SidebarProps) {
  const t = useTranslations("nav");
  const tRoles = useTranslations("common.roles");
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
      NEET_USER: { label: tRoles("NEET_USER"), color: "bg-blue-500/20 text-blue-300" },
      COUNSELOR: { label: tRoles("COUNSELOR"), color: "bg-green-500/20 text-green-300" },
      ADMIN: { label: tRoles("ADMIN"), color: "bg-purple-500/20 text-purple-300" },
    };
    return map[role];
  };

  const roleBadge = getRoleBadge(user.role);

  return (
    <>
    {/* Mobile backdrop */}
    <div
      onClick={onClose}
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    />
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex h-full w-64 max-w-[85vw] flex-col bg-[#0f3d47] text-white shadow-xl transition-transform duration-200",
        "lg:static lg:z-auto lg:max-w-none lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-700/50 px-5 py-4">
        <BrandMark className="h-9 w-9" rounded="rounded-lg" />
        <span className="text-sm font-bold tracking-widest text-white">
          RURAL-CONNECT
        </span>
      </div>

      {/* User info */}
      <div className="border-b border-slate-700/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#178593] text-sm font-semibold text-white">
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
                onClick={onClose}
                className={cn(
                  "sidebar-link",
                  active && "sidebar-link-active"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{t(item.key)}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#7fe0e6]" />
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
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-[#175562] hover:text-white"
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
            <div className="absolute bottom-full left-0 mb-1 w-full rounded-lg border border-slate-700 bg-[#0c333c] py-1 shadow-lg">
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={`/${loc}${pathname.replace(`/${locale}`, "")}`}
                  onClick={() => setLangOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[#175562]",
                    loc === locale
                      ? "font-medium text-[#178593]"
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
    </>
  );
}
