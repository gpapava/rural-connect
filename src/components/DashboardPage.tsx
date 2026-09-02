"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MessageSquare,
  FolderOpen,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronRight,
  Bell,
  Check,
  X,
  Award,
  Sparkles,
  Clock,
  ArrowRight,
  Lock,
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";

type CounselorInfo = { id: string; name: string; email: string; country: string | null };

type SessionSummary = {
  id: string;
  scheduledAt: Date;
  counselor: CounselorInfo;
};

type StageInfo = { number: number; status: "LOCKED" | "ACTIVE" | "COMPLETED" };

interface DashboardData {
  user: { id: string; name: string; email: string; country: string | null };
  upcomingSession: (SessionSummary & { status: string }) | null;
  pendingSession: SessionSummary | null;
  portfolio: { id: string; summary: string | null; targetSector: string | null; updatedAt: Date } | null;
  moduleStats: { total: number; completed: number; inProgress: number };
  stages: StageInfo[];
  certificate: { id: string; issuedAt: Date } | null;
}

interface DashboardPageProps {
  data: DashboardData;
  locale: string;
}

export default function DashboardPage({ data, locale }: DashboardPageProps) {
  const t = useTranslations("dashboard");
  const tStages = useTranslations("stages");
  const { user, upcomingSession, pendingSession, portfolio, moduleStats, stages, certificate } = data;

  const [pending, setPending] = useState(pendingSession);
  const [responding, setResponding] = useState(false);

  const firstName = user.name.split(" ")[0];
  const completedStages = stages.filter((s) => s.status === "COMPLETED").length;
  const activeStage = stages.find((s) => s.status === "ACTIVE");
  const allStagesDone = stages.length === 5 && completedStages === 5;
  const portfolioComplete = !!(portfolio?.summary && portfolio?.targetSector);

  const isWithin24h = (date: Date) => {
    const diff = new Date(date).getTime() - Date.now();
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
  };

  const isToday = (date: Date) => {
    const d = new Date(date);
    return d.toDateString() === new Date().toDateString();
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
    } finally {
      setResponding(false);
    }
  };

  // ── Determine the single "next step" state ──────────────────────────────────
  type NextStepKind =
    | "pending_invite"
    | "session_today"
    | "session_upcoming"
    | "journey_in_progress"
    | "certificate_ready"
    | "all_done"
    | "just_started";

  const getNextStep = (): NextStepKind => {
    if (pending) return "pending_invite";
    if (upcomingSession && isWithin24h(upcomingSession.scheduledAt)) return "session_today";
    if (upcomingSession) return "session_upcoming";
    if (certificate) return "all_done";
    if (allStagesDone) return "certificate_ready";
    if (stages.length > 0) return "journey_in_progress";
    return "just_started";
  };

  const nextStep = getNextStep();

  // Mini stage dots
  const StageDots = () => (
    <div className="flex items-center gap-1.5">
      {stages.length > 0
        ? stages.map((s) => (
            <div
              key={s.number}
              className={cn(
                "h-2 w-2 rounded-full",
                s.status === "COMPLETED" ? "bg-[#34a853]" : s.status === "ACTIVE" ? "bg-[#1a73e8]" : "bg-gray-200"
              )}
            />
          ))
        : [1, 2, 3, 4, 5].map((n) => <div key={n} className="h-2 w-2 rounded-full bg-gray-200" />)}
      <span className="ml-1 text-xs text-gray-400">
        {t("stagesProgress", { completed: completedStages })}
      </span>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("greeting", { name: firstName })}
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">{t("focusToday")}</p>
      </div>

      {/* ── Next Step Card ───────────────────────────────────────────────────── */}
      {nextStep === "pending_invite" && pending && (
        <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
              <Bell className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">{t("actionNeeded")}</p>
              <h2 className="text-lg font-bold text-gray-900">{t("sessionInvitation")}</h2>
            </div>
          </div>
          <p className="mb-1 text-sm text-gray-700">
            {t.rich("invitedYou", {
              name: pending.counselor.name,
              b: (chunks) => <span className="font-semibold">{chunks}</span>,
            })}
          </p>
          <div className="mb-5 flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            {formatDateTime(pending.scheduledAt)}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => respondToSession(pending.id, true)}
              disabled={responding}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1a73e8] py-3 text-sm font-semibold text-white hover:bg-[#1558b0] disabled:opacity-50"
            >
              <Check className="h-4 w-4" /> {t("accept")}
            </button>
            <button
              onClick={() => respondToSession(pending.id, false)}
              disabled={responding}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <X className="h-4 w-4" /> {t("decline")}
            </button>
          </div>
        </div>
      )}

      {nextStep === "session_today" && upcomingSession && (
        <div className="rounded-2xl border-2 border-[#1a73e8]/20 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Sparkles className="h-4 w-4 text-[#1a73e8]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1a73e8]">{t("today")}</p>
              <h2 className="text-lg font-bold text-gray-900">
                {isToday(upcomingSession.scheduledAt) ? t("sessionTodayTitle") : t("sessionTomorrowTitle")}
              </h2>
            </div>
          </div>
          <p className="mb-1 text-sm text-gray-700">
            {t.rich("withCounsellor", {
              name: upcomingSession.counselor.name,
              b: (chunks) => <span className="font-semibold">{chunks}</span>,
            })}
          </p>
          <p className="mb-5 text-sm text-gray-500">
            {new Date(upcomingSession.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <Link
            href={`/${locale}/counseling`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a73e8] py-3 text-sm font-semibold text-white hover:bg-[#1558b0]"
          >
            <MessageSquare className="h-4 w-4" /> {t("joinSession")}
          </Link>
        </div>
      )}

      {nextStep === "session_upcoming" && upcomingSession && (
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("nextStep")}</p>
              <h2 className="text-lg font-bold text-gray-900">{t("upcomingSession")}</h2>
            </div>
          </div>
          <p className="mb-1 text-sm text-gray-700">
            {t.rich("withCounsellor", {
              name: upcomingSession.counselor.name,
              b: (chunks) => <span className="font-semibold">{chunks}</span>,
            })}
          </p>
          <div className="mb-2 flex items-center gap-1.5 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            {formatDateTime(upcomingSession.scheduledAt)}
          </div>
          <div className="mb-5">
            <StageDots />
          </div>
          <Link
            href={`/${locale}/counseling`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1a73e8]/30 bg-[#1a73e8]/5 py-3 text-sm font-semibold text-[#1a73e8] hover:bg-[#1a73e8]/10"
          >
            <MessageSquare className="h-4 w-4" /> {t("viewCounsellingSession")}
          </Link>
        </div>
      )}

      {nextStep === "journey_in_progress" && (
        <div className="rounded-2xl border-2 border-[#1a73e8]/20 bg-gradient-to-br from-blue-50 to-slate-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <MessageSquare className="h-4 w-4 text-[#1a73e8]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#1a73e8]">{t("nextStep")}</p>
              <h2 className="text-lg font-bold text-gray-900">{t("continueJourney")}</h2>
            </div>
          </div>

          {activeStage && (
            <div className="mb-4 rounded-xl bg-white/70 px-4 py-3">
              <p className="text-xs font-medium text-gray-500">{t("currentlyOn")}</p>
              <p className="text-base font-semibold text-gray-900">
                {t("stageLine", {
                  number: activeStage.number,
                  name: tStages(`names.${activeStage.number}`),
                })}
              </p>
            </div>
          )}

          <div className="mb-5">
            <StageDots />
          </div>

          <Link
            href={`/${locale}/counseling`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a73e8] py-3 text-sm font-semibold text-white hover:bg-[#1558b0]"
          >
            {t("goToCounselling")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {nextStep === "certificate_ready" && (
        <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
              <Award className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-yellow-600">{t("almostThere")}</p>
              <h2 className="text-lg font-bold text-gray-900">{t("journeyComplete")}</h2>
            </div>
          </div>
          <p className="mb-5 text-sm text-gray-600">
            {t("journeyCompleteBody")}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-yellow-700">
            <Clock className="h-3.5 w-3.5" />
            {t("awaitingApproval")}
          </div>
        </div>
      )}

      {nextStep === "all_done" && certificate && (
        <div className="rounded-2xl border-2 border-[#34a853]/30 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Award className="h-4 w-4 text-[#34a853]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#34a853]">{t("congratulations")}</p>
              <h2 className="text-lg font-bold text-gray-900">{t("earnedCertificate")}</h2>
            </div>
          </div>
          <p className="mb-5 text-sm text-gray-600">
            {t("earnedCertificateBody")}
          </p>
          <Link
            href={`/${locale}/certificate/${certificate.id}`}
            target="_blank"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#34a853] py-3 text-sm font-semibold text-white hover:bg-[#2d9147]"
          >
            <Award className="h-4 w-4" /> {t("viewDownloadCertificate")}
          </Link>
        </div>
      )}

      {nextStep === "just_started" && (
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("gettingStarted")}</p>
              <h2 className="text-lg font-bold text-gray-900">{t("journeyAboutToBegin")}</h2>
            </div>
          </div>
          <p className="mb-5 text-sm text-gray-500">
            {t("justStartedBody")}
          </p>
          <Link
            href={`/${locale}/counseling`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            <MessageSquare className="h-4 w-4" /> {t("openCounsellingPage")}
          </Link>
        </div>
      )}

      {/* ── Secondary actions ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {/* Learning */}
        <Link
          href={`/${locale}/library`}
          className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 hover:border-blue-100 hover:shadow-sm transition-all"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{t("tiles.learning")}</p>
            {moduleStats.total > 0 ? (
              <p className="text-xs text-gray-400">{t("tiles.modulesDone", { completed: moduleStats.completed, total: moduleStats.total })}</p>
            ) : (
              <p className="text-xs text-gray-400">{t("tiles.exploreModules")}</p>
            )}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-400"
              style={{ width: moduleStats.total > 0 ? `${Math.round((moduleStats.completed / moduleStats.total) * 100)}%` : "0%" }}
            />
          </div>
        </Link>

        {/* Portfolio */}
        <Link
          href={`/${locale}/portfolio`}
          className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 hover:border-purple-100 hover:shadow-sm transition-all"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50">
            <FolderOpen className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{t("tiles.myProfile")}</p>
            <p className={cn("text-xs", portfolioComplete ? "text-[#34a853]" : "text-orange-500")}>
              {portfolioComplete ? t("tiles.profileComplete") : t("tiles.profileNeedsUpdating")}
            </p>
          </div>
          <div className={cn(
            "rounded-full px-2 py-0.5 text-center text-[10px] font-semibold w-fit",
            portfolioComplete ? "bg-green-50 text-[#34a853]" : "bg-orange-50 text-orange-600"
          )}>
            {portfolioComplete ? t("tiles.done") : t("tiles.todo")}
          </div>
        </Link>

        {/* Jobs */}
        <Link
          href={`/${locale}/labor-market`}
          className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 hover:border-green-100 hover:shadow-sm transition-all"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
            <Briefcase className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{t("tiles.jobOpenings")}</p>
            <p className="text-xs text-gray-400">{t("tiles.findOpportunities")}</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600">
            {t("tiles.browse")} <ChevronRight className="h-3 w-3" />
          </div>
        </Link>
      </div>
    </div>
  );
}
