"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  User,
  Phone,
  MapPin,
  Linkedin,
  GraduationCap,
  Plus,
  FileDown,
  Share2,
  Printer,
  Clock,
  CheckCircle,
  Loader,
  MessageSquare,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

type PortfolioData = {
  id: string;
  summary: string | null;
  targetSector: string | null;
  neetStatus: string | null;
  skills: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  linkedinUrl: string | null;
  updatedAt: Date;
  qualifications: {
    id: string;
    title: string;
    institution: string | null;
    status: string;
    completedAt: Date | null;
  }[];
} | null;

interface PortfolioPageProps {
  user: { id: string; name: string; email: string; country: string | null };
  portfolio: PortfolioData;
  latestSession: {
    id: string;
    notes: string | null;
    actionPlan: string | null;
    counselor: { id: string; name: string };
  } | null;
  locale: string;
}

export default function PortfolioPage({
  user,
  portfolio,
  latestSession,
  locale,
}: PortfolioPageProps) {
  const t = useTranslations("portfolio");

  const [summary, setSummary] = useState(portfolio?.summary ?? "");
  const [targetSector, setTargetSector] = useState(portfolio?.targetSector ?? "");
  const [neetStatus, setNeetStatus] = useState(portfolio?.neetStatus ?? "");
  const [skills, setSkills] = useState(portfolio?.skills ?? "");
  const [phone, setPhone] = useState(portfolio?.contactPhone ?? "");
  const [address, setAddress] = useState(portfolio?.contactAddress ?? "");
  const [linkedin, setLinkedin] = useState(portfolio?.linkedinUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const qualifications = portfolio?.qualifications ?? [];

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          targetSector,
          neetStatus,
          skills,
          contactPhone: phone,
          contactAddress: address,
          linkedinUrl: linkedin,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const getQualStatusIcon = (status: string) => {
    if (status === "completed")
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "in_progress")
      return <Loader className="h-4 w-4 text-blue-500" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  const getQualStatusClass = (status: string) => {
    if (status === "completed") return "badge-completed";
    if (status === "in_progress") return "badge-in-progress";
    return "badge-not-started";
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          {portfolio && (
            <p className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              {t("actions.lastUpdated")}: {formatDate(portfolio.updatedAt)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact info */}
          <div className="card">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <User className="h-4 w-4 text-[#1a73e8]" />
              {t("contact.title")}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  {t("contact.name")}
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  {user.name}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  {t("contact.email")}
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                  {user.email}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  {t("contact.phone")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+XX XXX XXX XXXX"
                    className="input-field pl-8"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  {t("contact.address")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="City, Country"
                    className="input-field pl-8"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  {t("contact.linkedin")}
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="input-field pl-8"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card">
            <h2 className="mb-3 text-base font-semibold text-gray-900">
              {t("summary.title")}
            </h2>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={t("summary.placeholder")}
              rows={4}
              className="input-field resize-none"
            />
          </div>

          {/* Target sector + NEET status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                {t("targetSector.title")}
              </h2>
              <input
                type="text"
                value={targetSector}
                onChange={(e) => setTargetSector(e.target.value)}
                placeholder={t("targetSector.placeholder")}
                className="input-field"
              />
            </div>
            <div className="card">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                {t("neetStatus.title")}
              </h2>
              <input
                type="text"
                value={neetStatus}
                onChange={(e) => setNeetStatus(e.target.value)}
                placeholder={t("neetStatus.placeholder")}
                className="input-field"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 className="mb-3 text-base font-semibold text-gray-900">
              {t("skills.title")}
            </h2>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder={t("skills.placeholder")}
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Qualifications */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <GraduationCap className="h-4 w-4 text-[#1a73e8]" />
                {t("qualifications.title")}
              </h2>
              <button className="btn-secondary py-1.5 px-3 text-xs">
                <Plus className="h-3.5 w-3.5" />
                {t("qualifications.add")}
              </button>
            </div>
            {qualifications.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">
                No qualifications added yet
              </p>
            ) : (
              <div className="space-y-3">
                {qualifications.map((qual) => (
                  <div
                    key={qual.id}
                    className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    {getQualStatusIcon(qual.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {qual.title}
                      </p>
                      {qual.institution && (
                        <p className="text-xs text-gray-500">
                          {qual.institution}
                        </p>
                      )}
                      {qual.completedAt && (
                        <p className="text-xs text-gray-400">
                          {formatDate(qual.completedAt)}
                        </p>
                      )}
                    </div>
                    <span className={getQualStatusClass(qual.status)}>
                      {qual.status === "completed"
                        ? t("qualifications.completed")
                        : t("qualifications.inProgress")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="card">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Portfolio Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary w-full"
              >
                {saving ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button className="btn-secondary w-full">
                <FileDown className="h-4 w-4" />
                {t("actions.export")}
              </button>
              <button className="btn-secondary w-full">
                <Share2 className="h-4 w-4" />
                {t("actions.share")}
              </button>
              <button className="btn-secondary w-full">
                <Printer className="h-4 w-4" />
                {t("actions.print")}
              </button>
            </div>
          </div>

          {/* Completion status */}
          <div className="card">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Profile Completion
            </h3>
            <div className="space-y-2">
              {[
                { label: "Personal Summary", done: !!summary },
                { label: "Contact Info", done: !!(phone || address) },
                { label: "Target Sector", done: !!targetSector },
                { label: "Skills", done: !!skills },
                { label: "Qualifications", done: qualifications.length > 0 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-600">{item.label}</span>
                  {item.done ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    ([
                      !!summary,
                      !!(phone || address),
                      !!targetSector,
                      !!skills,
                      qualifications.length > 0,
                    ].filter(Boolean).length /
                      5) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Counselor feedback */}
          <div className="card">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <MessageSquare className="h-4 w-4 text-[#1a73e8]" />
              {t("counselorFeedback.title")}
            </h3>
            {latestSession?.notes ? (
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  From {latestSession.counselor.name}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {latestSession.notes}
                </p>
                {latestSession.actionPlan && (
                  <>
                    <p className="mt-3 text-xs font-medium text-gray-600">
                      Action Plan:
                    </p>
                    <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                      {latestSession.actionPlan}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <p className="text-center text-xs text-gray-400 py-4">
                {t("counselorFeedback.noFeedback")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
