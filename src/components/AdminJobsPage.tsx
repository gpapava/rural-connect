"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, Trash2, ExternalLink, Clock, MapPin, Mail, Building2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

type JobStatus = "PENDING" | "APPROVED" | "REJECTED";

type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  country: string;
  location: string | null;
  contactName: string;
  contactEmail: string;
  website: string | null;
  status: JobStatus;
  adminNote: string | null;
  createdAt: Date;
};

const STATUS_COLOR: Record<JobStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};
const STATUS_LABEL_KEY: Record<JobStatus, string> = {
  PENDING: "statusPending",
  APPROVED: "statusApproved",
  REJECTED: "statusRejected",
};

export default function AdminJobsPage({ jobs: initial }: { jobs: Job[] }) {
  const t = useTranslations("admin.jobs");
  const tc = useTranslations("common.countries");
  const countryName = (code: string) => (tc.has(code) ? tc(code) : code);
  const [jobs, setJobs] = useState(initial);
  const [filter, setFilter] = useState<"all" | JobStatus>("PENDING");
  const [processing, setProcessing] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  const counts = {
    all: jobs.length,
    PENDING: jobs.filter((j) => j.status === "PENDING").length,
    APPROVED: jobs.filter((j) => j.status === "APPROVED").length,
    REJECTED: jobs.filter((j) => j.status === "REJECTED").length,
  };

  const updateStatus = async (jobId: string, status: "APPROVED" | "REJECTED") => {
    setProcessing(jobId);
    const res = await fetch(`/api/admin/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNote: noteInput[jobId] ?? null }),
    });
    if (res.ok) {
      const { job } = await res.json();
      setJobs((prev) => prev.map((j) => (j.id === jobId ? job : j)));
    }
    setProcessing(null);
  };

  const deleteJob = async (jobId: string, title: string) => {
    if (!confirm(t("confirmDelete", { title }))) return;
    setProcessing(jobId);
    const res = await fetch(`/api/admin/jobs/${jobId}`, { method: "DELETE" });
    if (res.ok) setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setProcessing(null);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {([
          { key: "PENDING",  label: t("filterPending", { count: counts.PENDING }) },
          { key: "APPROVED", label: t("filterApproved", { count: counts.APPROVED }) },
          { key: "REJECTED", label: t("filterRejected", { count: counts.REJECTED }) },
          { key: "all",      label: t("filterAll", { count: counts.all }) },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
              filter === key
                ? "border-[#1a73e8] bg-[#1a73e8] text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-[#1a73e8]/40"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <Clock className="mb-2 h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-400">{t("empty")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => {
            return (
              <div key={job.id} className="card">
                {/* Header row */}
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLOR[job.status])}>
                        {t(STATUS_LABEL_KEY[job.status])}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {countryName(job.country)}
                        {job.location && ` · ${job.location}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {job.contactEmail}
                      </span>
                      <span className="text-gray-400">{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1">
                    {job.website && (
                      <a
                        href={job.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        title={t("visitWebsite")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => deleteJob(job.id, job.title)}
                      disabled={processing === job.id}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                      title={t("delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 text-sm text-gray-600 line-clamp-3">{job.description}</p>

                {/* Admin note (if any) */}
                {job.adminNote && (
                  <p className="mb-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 italic">
                    {t("note", { note: job.adminNote })}
                  </p>
                )}

                {/* Actions — only for PENDING */}
                {job.status === "PENDING" && (
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <input
                      type="text"
                      placeholder={t("notePlaceholder")}
                      value={noteInput[job.id] ?? ""}
                      onChange={(e) => setNoteInput((prev) => ({ ...prev, [job.id]: e.target.value }))}
                      className="input-field text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(job.id, "APPROVED")}
                        disabled={processing === job.id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#34a853] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d9147] disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {t("approve")}
                      </button>
                      <button
                        onClick={() => updateStatus(job.id, "REJECTED")}
                        disabled={processing === job.id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        {t("reject")}
                      </button>
                    </div>
                  </div>
                )}

                {/* Re-review approved/rejected jobs */}
                {job.status !== "PENDING" && (
                  <div className="border-t border-gray-100 pt-3 flex gap-2">
                    {job.status === "APPROVED" && (
                      <button
                        onClick={() => updateStatus(job.id, "REJECTED")}
                        disabled={processing === job.id}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-red-200 hover:text-red-500 disabled:opacity-40"
                      >
                        {t("revokeApproval")}
                      </button>
                    )}
                    {job.status === "REJECTED" && (
                      <button
                        onClick={() => updateStatus(job.id, "APPROVED")}
                        disabled={processing === job.id}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-green-200 hover:text-green-600 disabled:opacity-40"
                      >
                        {t("approveInstead")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
