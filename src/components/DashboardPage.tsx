"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  MessageSquare,
  FolderOpen,
  BookOpen,
  Briefcase,
  FileText,
  Video,
  Search,
  BarChart2,
  Compass,
  PiggyBank,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  User,
  ChevronRight,
} from "lucide-react";
import { cn, formatDate, formatDateTime } from "@/lib/utils";

interface DashboardData {
  user: { id: string; name: string; email: string; country: string | null };
  upcomingSession: {
    id: string;
    scheduledAt: Date;
    status: string;
    counselor: { id: string; name: string; email: string; country: string | null };
  } | null;
  portfolio: {
    id: string;
    summary: string | null;
    targetSector: string | null;
    updatedAt: Date;
  } | null;
  moduleStats: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  stats: {
    sessionsCompleted: number;
    modulesFinished: number;
    daysActive: number;
  };
}

interface DashboardPageProps {
  data: DashboardData;
  locale: string;
}

const toolkitItems = [
  {
    key: "resumeBuilder",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
    href: "/portfolio",
  },
  {
    key: "interviewPrep",
    icon: Video,
    color: "text-purple-600",
    bg: "bg-purple-50",
    href: "/counseling",
  },
  {
    key: "jobSearch",
    icon: Search,
    color: "text-green-600",
    bg: "bg-green-50",
    href: "/labor-market",
  },
  {
    key: "skillsAssessment",
    icon: BarChart2,
    color: "text-orange-600",
    bg: "bg-orange-50",
    href: "/library",
  },
  {
    key: "careerExplorer",
    icon: Compass,
    color: "text-red-600",
    bg: "bg-red-50",
    href: "/library",
  },
  {
    key: "financialPlanning",
    icon: PiggyBank,
    color: "text-teal-600",
    bg: "bg-teal-50",
    href: "/library",
  },
];

export default function DashboardPage({ data, locale }: DashboardPageProps) {
  const t = useTranslations("dashboard");
  const { user, upcomingSession, portfolio, moduleStats, stats } = data;

  const progressPct =
    moduleStats.total > 0
      ? Math.round((moduleStats.completed / moduleStats.total) * 100)
      : 0;

  const portfolioComplete = !!(
    portfolio?.summary &&
    portfolio?.targetSector
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">
          {t("welcome")}, {user.name.split(" ")[0]}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: t("stats.sessionsCompleted"),
            value: stats.sessionsCompleted,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: t("stats.modulesFinished"),
            value: stats.modulesFinished,
            icon: BookOpen,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: t("stats.daysActive"),
            value: stats.daysActive,
            icon: TrendingUp,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((stat) => (
          <div key={stat.label} className="card flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl",
                stat.bg
              )}
            >
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* E-Learning Progress */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                {t("progress.title")}
              </h2>
              <Link
                href={`/${locale}/library`}
                className="flex items-center gap-1 text-xs font-medium text-[#1a73e8] hover:underline"
              >
                {t("progress.viewAll")}
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mb-3 flex items-end justify-between text-sm">
              <span className="text-gray-500">
                <span className="font-semibold text-gray-900">
                  {moduleStats.completed}
                </span>
                /{moduleStats.total} {t("progress.modulesCompleted")}
              </span>
              <span className="text-lg font-bold text-[#1a73e8]">
                {progressPct}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                {
                  label: "Completed",
                  value: moduleStats.completed,
                  color: "text-green-600",
                  dotColor: "bg-green-500",
                },
                {
                  label: "In Progress",
                  value: moduleStats.inProgress,
                  color: "text-blue-600",
                  dotColor: "bg-blue-500",
                },
                {
                  label: "Not Started",
                  value: moduleStats.notStarted,
                  color: "text-gray-500",
                  dotColor: "bg-gray-300",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-lg bg-gray-50 p-3"
                >
                  <span
                    className={cn(
                      "h-2 w-2 flex-shrink-0 rounded-full",
                      item.dotColor
                    )}
                  />
                  <div>
                    <div
                      className={cn("text-sm font-semibold", item.color)}
                    >
                      {item.value}
                    </div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href={`/${locale}/library`}
              className="btn-primary mt-4 w-full"
            >
              <BookOpen className="h-4 w-4" />
              {t("progress.continueLeaning")}
            </Link>
          </div>

          {/* Quick Access Toolkit */}
          <div className="card">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              {t("toolkit.title")}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {toolkitItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-center transition-all hover:border-[#1a73e8]/20 hover:bg-white hover:shadow-md"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                      item.bg
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", item.color)} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {t(`toolkit.${item.key}`)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Counselor Card */}
          <div className="card">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              {t("counselorCard.title")}
            </h2>
            {upcomingSession ? (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#1a73e8]/10 text-sm font-bold text-[#1a73e8]">
                    {upcomingSession.counselor.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {upcomingSession.counselor.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {upcomingSession.counselor.country
                        ? `${upcomingSession.counselor.country} · `
                        : ""}
                      Counselor
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-yellow-800">
                    <Calendar className="h-3.5 w-3.5" />
                    {t("counselorCard.nextSession")}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatDateTime(upcomingSession.scheduledAt)}
                  </p>
                </div>
                <Link
                  href={`/${locale}/counseling`}
                  className="btn-primary mt-3 w-full"
                >
                  <MessageSquare className="h-4 w-4" />
                  Open Chat
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  {t("counselorCard.noSession")}
                </p>
                <Link
                  href={`/${locale}/counseling`}
                  className="btn-secondary mt-3"
                >
                  {t("counselorCard.bookSession")}
                </Link>
              </div>
            )}
          </div>

          {/* Portfolio Card */}
          <div className="card">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              {t("portfolio.title")}
            </h2>
            <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-600">{t("portfolio.status")}</span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  portfolioComplete
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                )}
              >
                {portfolioComplete
                  ? t("portfolio.complete")
                  : t("portfolio.incomplete")}
              </span>
            </div>
            {portfolio && (
              <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                {t("portfolio.lastUpdated")}:{" "}
                {formatDate(portfolio.updatedAt)}
              </div>
            )}
            <Link
              href={`/${locale}/portfolio`}
              className={cn(
                "w-full",
                portfolioComplete ? "btn-secondary" : "btn-primary"
              )}
            >
              <FolderOpen className="h-4 w-4" />
              {portfolioComplete
                ? t("portfolio.viewPortfolio")
                : t("portfolio.updatePortfolio")}
            </Link>
          </div>

          {/* Labor Market */}
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  Job Opportunities
                </h3>
                <p className="text-xs text-gray-500">
                  Find employers in your area
                </p>
              </div>
            </div>
            <Link
              href={`/${locale}/labor-market`}
              className="btn-secondary mt-3 w-full"
            >
              <ChevronRight className="h-4 w-4" />
              Browse Opportunities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
