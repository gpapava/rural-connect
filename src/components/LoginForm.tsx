"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";

interface LoginFormProps {
  locale: string;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations("auth");
  const tRoles = useTranslations("common.roles");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("invalidCredentials"));
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch {
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t("loginTitle")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("loginSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {t("password")}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
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
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {t("loggingIn")}
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              {t("login")}
            </>
          )}
        </button>
      </form>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
          {t("demoAccounts")}
        </p>
        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">{tRoles("NEET_USER")}:</span>
            <span>user@ruralconnect.eu / neet123</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{tRoles("COUNSELOR")}:</span>
            <span>counselor@ruralconnect.eu / counselor123</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{tRoles("ADMIN")}:</span>
            <span>admin@ruralconnect.eu / admin123</span>
          </div>
        </div>
      </div>

      {/* Employer link */}
      <div className="mt-6 border-t border-gray-100 pt-5 text-center">
        <p className="text-xs text-gray-400">
          {t("employerPrompt")}{" "}
          <Link href={`/${locale}/jobs/new`} className="font-medium text-gray-600 hover:text-[#1a73e8] hover:underline">
            {t("employerLink")}
          </Link>
        </p>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        {t("noAccount")}{" "}
        <span className="group relative inline-block">
          <Link href={`/${locale}/auth/register`} className="font-medium text-[#1a73e8] hover:underline">
            {t("registerLink")}
          </Link>
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 w-64 rounded-lg bg-[#1e293b] px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 z-10">
            {t("registerTooltip")}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e293b]" />
          </span>
        </span>
      </p>
    </div>
  );
}
