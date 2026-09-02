"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserCheck } from "lucide-react";

interface CounsellorInviteFormProps {
  token: string;
  email: string;
  locale: string;
}

export default function CounsellorInviteForm({ token, email, locale }: CounsellorInviteFormProps) {
  const t = useTranslations("invite");
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/invite/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("registrationFailed"));
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push(`/${locale}/auth/login`);
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch {
      setError(t("genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          <UserCheck className="h-3.5 w-3.5" />
          {t("badge")}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{t("completeRegistration")}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("invitedAsCounsellor")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Pre-filled email (read-only) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("emailLabel")}</label>
          <input
            type="email"
            value={email}
            disabled
            className="input-field cursor-not-allowed bg-gray-50 text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-400">{t("emailHint")}</p>
        </div>

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
            {t("fullName")}
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("fullNamePlaceholder")}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
            {t("password")}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-400">{t("passwordHint")}</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
            {t("confirmPassword")}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t("creatingAccount")}
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4" />
              {t("submit")}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
