"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, KeyRound } from "lucide-react";

interface ChangePasswordFormProps {
  locale: string;
  email: string;
}

export default function ChangePasswordForm({ locale, email }: ChangePasswordFormProps) {
  const t = useTranslations("auth");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [neetDeclaration, setNeetDeclaration] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) return setError(t("passwordTooShort"));
    if (password !== confirm) return setError(t("passwordsDontMatch"));
    if (!neetDeclaration) return setError(t("neetDeclarationRequired"));
    if (!gdprConsent) return setError(t("gdprConsentRequired"));

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password, neetDeclaration, gdprConsent }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === "same"
            ? t("passwordSameAsTemp")
            : data.error === "weak"
              ? t("passwordTooShort")
              : t("genericError")
        );
        setLoading(false);
        return;
      }
      // Re-issue the session with the new password so the "must change" flag is cleared
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        window.location.href = `/${locale}/auth/login`;
        return;
      }
      window.location.href = `/${locale}/dashboard`;
    } catch {
      setError(t("genericError"));
      setLoading(false);
    }
  };

  const passwordField = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void
  ) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pr-10"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("changePasswordTitle")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("changePasswordSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {passwordField("new-password", t("newPassword"), password, setPassword)}
        {passwordField("confirm-password", t("confirmPassword"), confirm, setConfirm)}

        <div className="rounded-lg border border-[#1a73e8]/20 bg-blue-50 p-4">
          <label className="flex cursor-pointer gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <input
                type="checkbox"
                checked={neetDeclaration}
                onChange={(e) => setNeetDeclaration(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#1a73e8] focus:ring-[#1a73e8]"
              />
            </div>
            <span className="text-sm text-gray-700">{t("neetDeclarationText")}</span>
          </label>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <label className="flex cursor-pointer gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <input
                type="checkbox"
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#1a73e8] focus:ring-[#1a73e8]"
              />
            </div>
            <span className="text-sm text-gray-700">{t("gdprConsentText")}</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !neetDeclaration || !gdprConsent}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <KeyRound className="h-4 w-4" />
          {loading ? t("savingPassword") : t("savePassword")}
        </button>
      </form>
    </div>
  );
}
