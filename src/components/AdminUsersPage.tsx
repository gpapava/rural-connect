"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Users, Plus, Trash2, X, CheckCircle, Mail,
  Globe, Shield, UserCheck, User, Link2, Copy, Clock,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { UserRole } from "@prisma/client";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  country: string | null;
  language: string;
  createdAt: Date;
};

const ROLE_VALUES: UserRole[] = ["ADMIN", "COUNSELOR", "NEET_USER"];
const ROLE_COLOR: Record<UserRole, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  COUNSELOR: "bg-green-100 text-green-800",
  NEET_USER: "bg-blue-100 text-blue-800",
};
const LANGUAGE_VALUES = ["en", "el", "tr", "lv", "es", "it", "no"];

const ROLE_ICON: Record<UserRole, React.ElementType> = {
  ADMIN: Shield,
  COUNSELOR: UserCheck,
  NEET_USER: User,
};

const EMPTY_FORM = { name: "", email: "", password: "", role: "NEET_USER" as UserRole, country: "", language: "en" };

type InviteRow = { id: string; email: string; token: string; used: boolean; expiresAt: Date; createdAt: Date };

export default function AdminUsersPage({ users: initial, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const t = useTranslations("admin.users");
  const tc = useTranslations("common");
  const tRoles = useTranslations("common.roles");
  const tLangs = useTranslations("common.languages");
  const router = useRouter();

  const roleBadge = (role: UserRole) => (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", ROLE_COLOR[role])}>
      {tRoles(role)}
    </span>
  );
  const langLabel = (code: string) => (tLangs.has(code) ? tLangs(code) : code);
  const [users, setUsers] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<"all" | UserRole>("all");
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [showInvites, setShowInvites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = filterRole === "all" ? users : users.filter((u) => u.role === filterRole);

  const handleCreate = async () => {
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError(t("requiredFields"));
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? tc("somethingWentWrong"));
    } else {
      setUsers((prev) => [data.user, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    }
    setSaving(false);
  };

  const loadInvites = async () => {
    const res = await fetch("/api/admin/invites");
    if (res.ok) {
      const data = await res.json();
      setInvites(data.invites);
    }
  };

  const handleOpenInvites = async () => {
    if (!showInvites) await loadInvites();
    setShowInvites((v) => !v);
  };

  const handleCreateInvite = async () => {
    setInviteError(null);
    if (!inviteEmail.trim()) { setInviteError(t("emailRequired")); return; }
    setInviteLoading(true);
    const res = await fetch("/api/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });
    const data = await res.json();
    if (!res.ok) {
      setInviteError(data.error ?? tc("somethingWentWrong"));
    } else {
      setInvites((prev) => [data.invite, ...prev]);
      setInviteEmail("");
    }
    setInviteLoading(false);
  };

  const handleRevokeInvite = async (id: string) => {
    const res = await fetch("/api/admin/invites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setInvites((prev) => prev.filter((i) => i.id !== id));
  };

  const copyInviteLink = (token: string, id: string) => {
    const url = `${window.location.origin}/en/auth/invite/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t("confirmDelete", { name }))) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      const data = await res.json();
      alert(data.error ?? t("couldNotDelete"));
    }
    setDeletingId(null);
  };

  const counts = {
    all: users.length,
    ADMIN: users.filter((u) => u.role === "ADMIN").length,
    COUNSELOR: users.filter((u) => u.role === "COUNSELOR").length,
    NEET_USER: users.filter((u) => u.role === "NEET_USER").length,
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500">{t("registeredUsers", { count: users.length })}</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(null); }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          {t("newUser")}
        </button>
      </div>

      {/* Counsellor Invite Panel */}
      <div className="mb-6 rounded-xl border border-green-200 bg-green-50">
        <button
          onClick={handleOpenInvites}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-green-700" />
            <span className="text-sm font-semibold text-green-800">{t("inviteCounsellor")}</span>
            <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-800">
              {t("tokenLink")}
            </span>
          </div>
          <span className="text-xs text-green-600">{showInvites ? tc("hide") : tc("show")}</span>
        </button>

        {showInvites && (
          <div className="border-t border-green-200 px-5 pb-5 pt-4 space-y-4">
            <p className="text-xs text-green-700">
              {t("inviteHint")}
            </p>

            {inviteError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {inviteError}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder={t("invitePlaceholder")}
                className="input-field flex-1 text-sm"
              />
              <button
                onClick={handleCreateInvite}
                disabled={inviteLoading}
                className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
              >
                {inviteLoading ? t("generating") : t("generateLink")}
              </button>
            </div>

            {invites.length > 0 && (
              <div className="space-y-2">
                {invites.map((invite) => {
                  const expired = new Date(invite.expiresAt) < new Date();
                  return (
                    <div
                      key={invite.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-xs",
                        invite.used
                          ? "border-gray-100 bg-white text-gray-400"
                          : expired
                          ? "border-orange-100 bg-orange-50 text-orange-600"
                          : "border-green-100 bg-white text-gray-700"
                      )}
                    >
                      <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{invite.email}</p>
                        <p className="text-gray-400">
                          {invite.used
                            ? t("used")
                            : expired
                            ? t("expired")
                            : t("expiresOn", { date: new Date(invite.expiresAt).toLocaleDateString() })}
                        </p>
                      </div>
                      {!invite.used && !expired && (
                        <button
                          onClick={() => copyInviteLink(invite.token, invite.id)}
                          className="flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-1 text-green-700 hover:bg-green-100"
                          title={t("copyInviteLink")}
                        >
                          {copiedId === invite.id ? (
                            <><CheckCircle className="h-3 w-3" /> {t("copied")}</>
                          ) : (
                            <><Copy className="h-3 w-3" /> {t("copyLink")}</>
                          )}
                        </button>
                      )}
                      {!invite.used && (
                        <button
                          onClick={() => handleRevokeInvite(invite.id)}
                          className="rounded-md p-1 text-gray-300 hover:bg-red-50 hover:text-red-400"
                          title={t("revoke")}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card mb-6 border border-[#1a73e8]/20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">{t("createNewUser")}</h2>
            <button onClick={() => { setShowForm(false); setError(null); setForm(EMPTY_FORM); }} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">{t("fullName")} *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder={t("namePlaceholder")}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">{t("email")} *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder={t("emailPlaceholder")}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">{t("password")} *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder={t("passwordPlaceholder")}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">{t("role")} *</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                className="input-field"
              >
                {ROLE_VALUES.map((r) => (
                  <option key={r} value={r}>{tRoles(r)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">{t("country")}</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                placeholder={t("countryPlaceholder")}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">{t("language")}</label>
              <select
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                className="input-field"
              >
                {LANGUAGE_VALUES.map((l) => (
                  <option key={l} value={l}>{tLangs(l)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button onClick={() => { setShowForm(false); setError(null); setForm(EMPTY_FORM); }} className="btn-secondary">
              {tc("cancel")}
            </button>
            <button onClick={handleCreate} disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? t("creating") : (
                <><CheckCircle className="h-4 w-4" /> {t("createUser")}</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Role filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {([
          { key: "all", label: t("filterAll", { count: counts.all }) },
          { key: "ADMIN",     label: t("filterAdmins", { count: counts.ADMIN }) },
          { key: "COUNSELOR", label: t("filterCounselors", { count: counts.COUNSELOR }) },
          { key: "NEET_USER", label: t("filterNeet", { count: counts.NEET_USER }) },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilterRole(key)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
              filterRole === key
                ? "border-[#1a73e8] bg-[#1a73e8] text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-[#1a73e8]/40 hover:text-[#1a73e8]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* User table */}
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{t("colUser")}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{t("colRole")}</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:table-cell">{t("colCountry")}</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 md:table-cell">{t("colLanguage")}</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 lg:table-cell">{t("colJoined")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((user) => {
              const Icon = ROLE_ICON[user.role];
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id} className={cn("transition-colors hover:bg-gray-50", isSelf && "bg-blue-50/40")}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                        {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.name}
                          {isSelf && <span className="ml-1.5 text-xs text-[#1a73e8]">{t("you")}</span>}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{roleBadge(user.role)}</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{user.country ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{langLabel(user.language)}</td>
                  <td className="hidden px-4 py-3 text-gray-400 lg:table-cell">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {!isSelf && (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={deletingId === user.id}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                        title={t("deleteUser")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                  {t("noUsers")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
