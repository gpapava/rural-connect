"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Briefcase, CheckCircle2 } from "lucide-react";

const COUNTRY_CODES = ["NO", "GR", "TR", "LV", "ES", "IT"];

export default function JobPostForm() {
  const t = useTranslations("jobPost");
  const tc = useTranslations("common.countries");
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    country: "",
    location: "",
    contactName: "",
    contactEmail: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("submissionFailed"));
      } else {
        setSubmitted(true);
      }
    } catch {
      setError(t("genericError"));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-[#34a853]" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">{t("submittedTitle")}</h2>
        <p className="max-w-sm text-sm text-gray-500">
          {t("submittedBody")}
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ title: "", company: "", description: "", country: "", location: "", contactName: "", contactEmail: "", website: "" }); }}
          className="mt-6 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {t("submitAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Job details */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          {t("jobDetails")}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("jobTitle")} *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={update("title")}
              placeholder={t("jobTitlePlaceholder")}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("company")} *</label>
            <input
              type="text"
              required
              value={form.company}
              onChange={update("company")}
              placeholder={t("companyPlaceholder")}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("country")} *</label>
            <select required value={form.country} onChange={update("country")} className="input-field">
              <option value="">{t("selectCountry")}</option>
              {COUNTRY_CODES.map((code) => (
                <option key={code} value={code}>{tc(code)}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("location")}</label>
            <input
              type="text"
              value={form.location}
              onChange={update("location")}
              placeholder={t("locationPlaceholder")}
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("description")} *</label>
            <textarea
              required
              value={form.description}
              onChange={update("description")}
              rows={5}
              placeholder={t("descriptionPlaceholder")}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            />
          </div>
        </div>
      </div>

      {/* Contact details */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          {t("contactInformation")}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("contactName")} *</label>
            <input
              type="text"
              required
              value={form.contactName}
              onChange={update("contactName")}
              placeholder={t("contactNamePlaceholder")}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("contactEmail")} *</label>
            <input
              type="email"
              required
              value={form.contactEmail}
              onChange={update("contactEmail")}
              placeholder={t("contactEmailPlaceholder")}
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("website")}</label>
            <input
              type="url"
              value={form.website}
              onChange={update("website")}
              placeholder={t("websitePlaceholder")}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-xs text-amber-800">
        {t("notice")}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {t("submitting")}
          </>
        ) : (
          <>
            <Briefcase className="h-4 w-4" />
            {t("submit")}
          </>
        )}
      </button>
    </form>
  );
}
