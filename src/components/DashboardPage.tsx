"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
  Bell,
  Check,
  X,
  History,
} from "lucide-react";
import { cn, formatDate, formatDateTime } from "@/lib/utils";

type CounselorInfo = {
  id: string;
  name: string;
  email: string;
  country: string | null;
};

type SessionSummary = {
  id: string;
  scheduledAt: Date;
  counselor: CounselorInfo;
};

interface DashboardData {
  user: { id: string; name: string; email: string; country: string | null };
  upcomingSession: (SessionSummary & { status: string }) | null;
  pendingSession: SessionSummary | null;
  pastSessions: SessionSummary[];
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
  { key: "resumeBuilder", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", href: "/portfolio" },
  { key: "interviewPrep", icon: Video, color: "text-purple-600", bg: "bg-purple-50", href: "/counseling" },
  { key: "jobSearch", icon: Search, color: "text-green-600", bg: "bg-green-50", href: "/labor-market" },
  { key: "skillsAssessment", icon: BarChart2, color: "text-orange-600", bg: "bg-orange-50", href: "/library" },
  { key: "careerExplorer", icon: Compass, color: "text-red-600", bg: "bg-red-50", href: "/library" },
  { key: "financialPlanning", icon: PiggyBank, color: "text-teal-600", bg: "bg-teal-50", href: "/library" },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function DashboardPage({ data, locale }: DashboardPageProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { user, upcomingSession, pendingSession, pastSessions, portfolio, moduleStats, stats } = data;

  const [pending, setPending] = useState(pendingSession);
  const [responding, setResponding] = useState(false);

  const progressPct =
    moduleStats.total > 0
      ? Math.round((moduleStats.completed / moduleStats.total) * 100)
      : 0;

  const portfolioComplete = !!(portfolio?.summary && portfolio?.targetSector);

  const isToday = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const isWithin24h = (date: Date) => {
    const d = new Date(date);
    const diff = d.getTime() - Date.now();
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
  };

  const respondToSession = async (sessionId: string, accept: boolean) => {
    setResponding(true);
    try {
      await fetch(`/api/sessions/${sessionId}/respond`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      setPending(null);
      if (accept) {
        router.refresh();
      }
    } finally {
      setResponding(false);
    }
  };

  const showUrgentBanner =
    upcomingSession && isWithin24h(upcomingSession.scheduledAt);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">
          {t("welcome")}, {user.name.split(" ")[0]}
        </p>
      </div>

      {/* Upcoming session reminder banner */}
      {showUrgentBanner && (
        <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1a73e8]/10">
            <Bell className="h-5 w-5 text-[#1a73e8]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {isToday(upcomingSession!.scheduledAt)
                ? "You have a session today"
                : "Upcoming session tomorrow"}
            </p>
            <p className="text-xs text-gray-600">
              With {upcomingSession!.counselor.name} at{" "}
              {new Date(upcomingSession!.scheduledAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Link
            href={`/${locale}/counseling`}
            className="flex-shrink-0 rounded-lg bg-[#1a73e8] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1558b0]"
          >
            Join Session
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: t("stats.sessionsCompleted"), value: stats.sessionsCompleted, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: t("stats.modulesFinished"), value: stats.modulesFinished, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
          { label: t("stats.daysActive"), value: stats.daysActive, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => (
          <div key={stat.label} className="card flex items-center gap-4">
            <div className={cn("flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
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
              <h2 className="text-base font-semibold text-gray-900">{t("progress.title")}</h2>
              <Link href={`/${locale}/library`} className="flex items-center gap-1 text-xs font-medium text-[#1a73e8] hover:underline">
                {t("progress.viewAll")}
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mb-3 flex items-end justify-between text-sm">
              <span className="text-gray-500">
                <span className="font-semibold text-gray-900">{moduleStats.completed}</span>
                /{moduleStats.total} {t("progress.modulesCompleted")}
              </span>
              <span className="text-lg font-bold text-[#1a73e8]">{progressPct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Completed", value: moduleStats.completed, color: "text-green-600", dotColor: "bg-green-500" },
                { label: "In Progress", value: moduleStats.inProgress, color: "text-blue-600", dotColor: "bg-blue-500" },
                { label: "Not Started", value: moduleStats.notStarted, color: "text-gray-500", dotColor: "bg-gray-300" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                  <span className={cn("h-2 w-2 flex-shrink-0 rounded-full", item.dotColor)} />
                  <div>
                    <div className={cn("text-sm font-semibold", item.color)}>{item.value}</div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href={`/${locale}/library`} className="btn-primary mt-4 w-full">
              <BookOpen className="h-4 w-4" />
              {t("progress.continueLeaning")}
            </Link>
          </div>

          {/* Quick Access Toolkit */}
          <div className="card">
            <h2 className="mb-4 text-base font-semibold text-gray-900">{t("toolkit.title")}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {toolkitItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-center transition-all hover:border-[#1a73e8]/20 hover:bg-white hover:shadow-md"
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110", item.bg)}>
                    <item.icon className={cn("h-5 w-5", item.color)} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{t(`toolkit.${item.key}`)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Counseling Sessions card */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Counseling Sessions</h2>
              <Link href={`/${locale}/counseling`} className="flex items-center gap-1 text-xs font-medium text-[#1a73e8] hover:underline">
                Open
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Pending invite */}
            {pending && (
              <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-orange-500" />
                  <p className="text-xs font-semibold text-orange-800">Session Invitation</p>
                </div>
                <p className="mb-1 text-sm font-medium text-gray-900">
                  {pending.counselor.name}
                </p>
                <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-600">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDateTime(pending.scheduledAt)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => respondToSession(pending.id, true)}
                    disabled={responding}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#1a73e8] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1558b0] disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Accept
                  </button>
                  <button
                    onClick={() => respondToSession(pending.id, false)}
                    disabled={responding}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* Next scheduled session */}
            {upcomingSession ? (
              <div className="mb-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Next Session</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1a73e8]/10 text-xs font-bold text-[#1a73e8]">
                    {getInitials(upcomingSession.counselor.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{upcomingSession.counselor.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDateTime(upcomingSession.scheduledAt)}
                    </div>
                  </div>
                </div>
                <Link href={`/${locale}/counseling`} className="btn-primary mt-3 w-full">
                  <MessageSquare className="h-4 w-4" />
                  Open Session
                </Link>
              </div>
            ) : !pending ? (
              <div className="mb-4 flex flex-col items-center py-4 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">{t("counselorCard.noSession")}</p>
              </div>
            ) : null}

            {/* Past sessions */}
            {pastSessions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" />
                  Past Sessions
                </p>
                <div className="space-y-2">
                  {pastSessions.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-gray-700">{s.counselor.name}</p>
                        <p className="text-xs text-gray-400">{formatDate(s.scheduledAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Portfolio Card */}
          <div className="card">
            <h2 className="mb-4 text-base font-semibold text-gray-900">{t("portfolio.title")}</h2>
            <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-600">{t("portfolio.status")}</span>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", portfolioComplete ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800")}>
                {portfolioComplete ? t("portfolio.complete") : t("portfolio.incomplete")}
              </span>
            </div>
            {portfolio && (
              <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                {t("portfolio.lastUpdated")}: {formatDate(portfolio.updatedAt)}
              </div>
            )}
            <Link href={`/${locale}/portfolio`} className={cn("w-full", portfolioComplete ? "btn-secondary" : "btn-primary")}>
              <FolderOpen className="h-4 w-4" />
              {portfolioComplete ? t("portfolio.viewPortfolio") : t("portfolio.updatePortfolio")}
            </Link>
          </div>

          {/* Labor Market */}
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Job Opportunities</h3>
                <p className="text-xs text-gray-500">Find employers in your area</p>
              </div>
            </div>
            <Link href={`/${locale}/labor-market`} className="btn-secondary mt-3 w-full">
              <ChevronRight className="h-4 w-4" />
              Browse Opportunities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
