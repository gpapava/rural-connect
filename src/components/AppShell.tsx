"use client";

import { useState } from "react";
import { UserRole } from "@prisma/client";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

interface AppShellProps {
  locale: string;
  user: { id: string; name: string; email: string; role: UserRole };
  children: React.ReactNode;
}

/** Page chrome. Below the lg breakpoint the sidebar is an overlay drawer opened from the topbar. */
export default function AppShell({ locale, user, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar locale={locale} user={user} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar locale={locale} user={user} onMenuClick={() => setMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
