"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Eye, EyeOff, FileSpreadsheet, Upload, Copy, CheckCircle } from "lucide-react";

const LANGUAGE_VALUES = ["en", "el", "tr", "lv", "es", "it", "no"];

type Issue = { line: number; email?: string; reason: string };
type Result = { created: number; skipped: Issue[]; invalid: Issue[] };

// Readable random password without look-alike characters (no 0/O, 1/l/I)
function generatePassword(length = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

const TEMPLATE_CSV =
  "name,email,country,language\n" +
  "Maria Example,maria@example.com,GR,el\n" +
  "John Example,john@example.com,NO,no\n";

export default function ImportNeetsPanel() {
  const locale = useLocale();
  const t = useTranslations("admin.users");
  const tc = useTranslations("common");
  const tLangs = useTranslations("common.languages");

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState(LANGUAGE_VALUES.includes(locale) ? locale : "en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [usedPassword, setUsedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const downloadTemplate = () => {
    const blob = new Blob(["﻿" + TEMPLATE_CSV], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neet-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!file) return setError(t("importNoFile"));
    if (password.length < 8) return setError(t("importPasswordShort"));

    setLoading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("oneTimePassword", password);
      body.append("defaultLanguage", language);
      const res = await fetch("/api/admin/users/import", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = Array.isArray(data.issues) && data.issues[0] ? ` (${data.issues[0].reason})` : "";
        setError((data.error ?? t("importFailed")) + detail);
        return;
      }
      setResult(data as Result);
      setUsedPassword(password);
      setPassword("");
      setFile(null);
    } catch {
      setError(t("importFailed"));
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(usedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-blue-700" />
          <span className="text-sm font-semibold text-blue-800">{t("importTitle")}</span>
          <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-800">
            {t("importBadge")}
          </span>
        </div>
        <span className="text-xs text-blue-600">{open ? tc("hide") : tc("show")}</span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-blue-200 px-5 pb-5 pt-4">
          {result ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                <CheckCircle className="h-4 w-4" />
                {t("importCreated", { count: result.created })}
              </div>

              {result.created > 0 && (
                <div className="rounded-lg border border-blue-200 bg-white p-3">
                  <p className="mb-1 text-xs text-gray-600">{t("importShare")}</p>
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-900">
                      {usedPassword}
                    </code>
                    <button type="button" onClick={copyPassword} aria-label="Copy" title="Copy" className="btn-secondary px-2 py-1 text-xs">
                      <Copy className="h-3 w-3" />
                      {copied ? t("copied") : null}
                    </button>
                  </div>
                </div>
              )}

              {result.skipped.length > 0 && (
                <details className="text-xs text-gray-700">
                  <summary className="cursor-pointer font-medium">
                    {t("importSkipped", { count: result.skipped.length })}
                  </summary>
                  <ul className="mt-1 list-disc pl-5">
                    {result.skipped.map((s, i) => (
                      <li key={i}>{t("importLine", { line: s.line })} — {s.email}</li>
                    ))}
                  </ul>
                </details>
              )}

              {result.invalid.length > 0 && (
                <details className="text-xs text-red-700" open>
                  <summary className="cursor-pointer font-medium">
                    {t("importInvalid", { count: result.invalid.length })}
                  </summary>
                  <ul className="mt-1 list-disc pl-5">
                    {result.invalid.map((s, i) => (
                      <li key={i}>
                        {t("importLine", { line: s.line })}
                        {s.email ? ` — ${s.email}` : ""}: {s.reason}
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              <div className="flex gap-2">
                <button type="button" className="btn-primary text-sm" onClick={() => window.location.reload()}>
                  {t("importReload")}
                </button>
                <button type="button" className="btn-secondary text-sm" onClick={() => setResult(null)}>
                  {t("importSubmit")}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-blue-800">{t("importHint")}</p>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">{t("importFile")}</label>
                <input
                  type="file"
                  accept=".xlsx,.csv,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                />
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="mt-1 text-xs font-medium text-blue-700 hover:underline"
                >
                  {t("importTemplate")}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">{t("importPassword")}</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="off"
                        className="input-field w-full pr-9 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setPassword(generatePassword()); setShowPassword(true); }}
                      className="btn-secondary text-xs"
                    >
                      {t("generate")}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{t("importPasswordHint")}</p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">{t("importDefaultLanguage")}</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-field w-full text-sm"
                  >
                    {LANGUAGE_VALUES.map((l) => (
                      <option key={l} value={l}>{tLangs.has(l) ? tLangs(l) : l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary text-sm disabled:opacity-50">
                <Upload className="h-4 w-4" />
                {loading ? t("importing") : t("importSubmit")}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
