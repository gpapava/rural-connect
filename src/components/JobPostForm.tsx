"use client";

import { useState } from "react";
import { Briefcase, CheckCircle2 } from "lucide-react";

const COUNTRIES = [
  { code: "NO", label: "Norway" },
  { code: "GR", label: "Greece" },
  { code: "TR", label: "Turkey" },
  { code: "LV", label: "Latvia" },
  { code: "ES", label: "Spain" },
  { code: "IT", label: "Italy" },
];

export default function JobPostForm() {
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
        setError(data.error || "Submission failed. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
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
        <h2 className="mb-2 text-xl font-bold text-gray-900">Job Opening Submitted!</h2>
        <p className="max-w-sm text-sm text-gray-500">
          Your job opening has been submitted for review. Once approved by our team, it will
          appear in the Rural-Connect Labor Market section visible to all users.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ title: "", company: "", description: "", country: "", location: "", contactName: "", contactEmail: "", website: "" }); }}
          className="mt-6 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Submit another opening
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
          Job Details
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Job Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={update("title")}
              placeholder="e.g. Agricultural Worker, IT Support Technician"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Company / Organisation *</label>
            <input
              type="text"
              required
              value={form.company}
              onChange={update("company")}
              placeholder="Your company name"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Country *</label>
            <select required value={form.country} onChange={update("country")} className="input-field">
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Location / City</label>
            <input
              type="text"
              value={form.location}
              onChange={update("location")}
              placeholder="e.g. Athens, Rural Attica"
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Job Description *</label>
            <textarea
              required
              value={form.description}
              onChange={update("description")}
              rows={5}
              placeholder="Describe the role, responsibilities, requirements, and what you offer..."
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            />
          </div>
        </div>
      </div>

      {/* Contact details */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Contact Name *</label>
            <input
              type="text"
              required
              value={form.contactName}
              onChange={update("contactName")}
              placeholder="Your name or HR contact"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Contact Email *</label>
            <input
              type="email"
              required
              value={form.contactEmail}
              onChange={update("contactEmail")}
              placeholder="hr@yourcompany.com"
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Company Website</label>
            <input
              type="url"
              value={form.website}
              onChange={update("website")}
              placeholder="https://www.yourcompany.com"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-xs text-amber-800">
        Your job opening will be reviewed by our team before it appears publicly. We aim to
        review submissions within 2 business days. Only opportunities suitable for NEET youth
        in rural areas will be approved.
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Submitting…
          </>
        ) : (
          <>
            <Briefcase className="h-4 w-4" />
            Submit Job Opening
          </>
        )}
      </button>
    </form>
  );
}
