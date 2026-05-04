"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  Clock,
  CheckCircle,
  PlayCircle,
  RotateCcw,
  ChevronRight,
  Filter,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

type ModuleWithProgress = {
  id: string;
  title: string;
  description: string;
  order: number;
  category: string;
  duration: number | null;
  status: string;
  completedAt: Date | null;
};

interface LibraryPageProps {
  modules: ModuleWithProgress[];
  locale: string;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Digital Skills": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "Career Development": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "Life Skills": {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  Entrepreneurship: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  Agriculture: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  general: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

export default function LibraryPage({ modules, locale }: LibraryPageProps) {
  const t = useTranslations("library");
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    ...Array.from(new Set(modules.map((m) => m.category))),
  ];

  const filtered =
    selectedCategory === "all"
      ? modules
      : modules.filter((m) => m.category === selectedCategory);

  const stats = {
    completed: modules.filter((m) => m.status === "COMPLETED").length,
    inProgress: modules.filter((m) => m.status === "IN_PROGRESS").length,
    notStarted: modules.filter((m) => m.status === "NOT_STARTED").length,
    total: modules.length,
  };

  const progressPct =
    stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <span className="badge-completed">{t("module.completed")}</span>;
      case "IN_PROGRESS":
        return (
          <span className="badge-in-progress">{t("module.inProgress")}</span>
        );
      default:
        return (
          <span className="badge-not-started">{t("module.notStarted")}</span>
        );
    }
  };

  const getActionButton = (status: string, moduleId: string) => {
    const go = () => router.push(`/${locale}/library/${moduleId}`);
    switch (status) {
      case "COMPLETED":
        return (
          <button onClick={go} className="btn-secondary text-xs py-1.5 px-3">
            <RotateCcw className="h-3.5 w-3.5" />
            {t("module.review")}
          </button>
        );
      case "IN_PROGRESS":
        return (
          <button onClick={go} className="btn-primary text-xs py-1.5 px-3">
            <ChevronRight className="h-3.5 w-3.5" />
            {t("module.continue")}
          </button>
        );
      default:
        return (
          <button onClick={go} className="btn-primary text-xs py-1.5 px-3">
            <PlayCircle className="h-3.5 w-3.5" />
            {t("module.start")}
          </button>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      {/* Progress overview */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">
              {t("progress.title")}
            </h2>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {stats.completed} {t("progress.completed")}
              </span>
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                {stats.inProgress} {t("progress.inProgress")}
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="h-2 w-2 rounded-full bg-gray-300" />
                {stats.notStarted} {t("progress.notStarted")}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#1a73e8]">
              {progressPct}%
            </div>
            <div className="text-xs text-gray-500">Overall Progress</div>
          </div>
        </div>
        <div className="mt-4 progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
              selectedCategory === cat
                ? "border-[#1a73e8] bg-[#1a73e8] text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-[#1a73e8]/40 hover:text-[#1a73e8]"
            )}
          >
            {cat === "all" ? t("categories.all") : cat}
          </button>
        ))}
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((module) => {
          const catStyle =
            categoryColors[module.category] ?? categoryColors.general;

          return (
            <div
              key={module.id}
              className={cn(
                "card group flex flex-col transition-shadow hover:shadow-md",
                module.status === "COMPLETED" && "opacity-90"
              )}
            >
              {/* Card header */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <div
                  className={cn(
                    "rounded-lg border px-2 py-1 text-xs font-medium",
                    catStyle.bg,
                    catStyle.text,
                    catStyle.border
                  )}
                >
                  {module.category}
                </div>
                {getStatusBadge(module.status)}
              </div>

              {/* Module icon */}
              <div
                className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
                  catStyle.bg
                )}
              >
                <BookOpen className={cn("h-6 w-6", catStyle.text)} />
              </div>

              {/* Content */}
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                {module.title}
              </h3>
              <p className="mb-4 flex-1 text-xs leading-relaxed text-gray-500">
                {module.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {module.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {module.duration} {t("module.duration")}
                    </span>
                  )}
                  {module.status === "COMPLETED" && module.completedAt && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      {formatDate(module.completedAt)}
                    </span>
                  )}
                </div>
                {getActionButton(module.status, module.id)}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <BookOpen className="h-7 w-7 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">
            No modules found for this category
          </p>
        </div>
      )}
    </div>
  );
}
