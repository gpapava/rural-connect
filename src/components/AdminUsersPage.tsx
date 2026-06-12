"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Plus, Trash2, X, CheckCircle, Mail,
  Globe, Shield, UserCheck, User,
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

const ROLES: { value: UserRole; label: string; color: string }[] = [
  { value: "ADMIN",     label: "Admin",       color: "bg-purple-100 text-purple-800" },
  { value: "COUNSELOR", label: "Counselor",   color: "bg-green-100 text-green-800"   },
  { value: "NEET_USER", label: "NEET User",   color: "bg-blue-100 text-blue-800"     },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "el", label: "Greek" },
  { value: "tr", label: "Turkish" },
  { value: "lv", label: "Latvian" },
  { value: "es", label: "Spanish" },
  { value: "it", label: "Italian" },
  { value: "no", label: "Norwegian" },
];

const ROLE_ICON: Record<UserRole, React.ElementType> = {
  ADMIN: Shield,
  COUNSELOR: UserCheck,
  NEET_USER: User,
};

function roleBadge(role: UserRole) {
  const r = ROLES.find((x) => x.value === role)!;
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", r.color)}>
      {r.label}
    </span>
  );
}

const EMPTY_FORM = { name: "", email: "", password: "", role: "NEET_USER" as UserRole, country: "", language: "en" };

export default function AdminUsersPage({ users: initial, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<"all" | UserRole>("all");

  const filtered = filterRole === "all" ? users : users.filter((u) => u.role === filterRole);

  const handleCreate = async () => {
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Name, email and password are required.");
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
      setError(data.error ?? "Something went wrong.");
    } else {
      setUsers((prev) => [data.user, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      const data = await res.json();
      alert(data.error ?? "Could not delete user.");
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">{users.length} registered user{users.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(null); }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          New User
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card mb-6 border border-[#1a73e8]/20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Create New User</h2>
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
              <label className="mb-1 block text-xs font-medium text-gray-600">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Maria Papadopoulou"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="user@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Password *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Min. 8 characters recommended"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Role *</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                className="input-field"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Country</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                placeholder="e.g. GR, NO, TR…"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Language</label>
              <select
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                className="input-field"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button onClick={() => { setShowForm(false); setError(null); setForm(EMPTY_FORM); }} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? "Creating…" : (
                <><CheckCircle className="h-4 w-4" /> Create User</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Role filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {([
          { key: "all", label: `All (${counts.all})` },
          { key: "ADMIN",     label: `Admins (${counts.ADMIN})` },
          { key: "COUNSELOR", label: `Counselors (${counts.COUNSELOR})` },
          { key: "NEET_USER", label: `NEET Users (${counts.NEET_USER})` },
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Role</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:table-cell">Country</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 md:table-cell">Language</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 lg:table-cell">Joined</th>
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
                          {isSelf && <span className="ml-1.5 text-xs text-[#1a73e8]">(you)</span>}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{roleBadge(user.role)}</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{user.country ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell capitalize">{LANGUAGES.find((l) => l.value === user.language)?.label ?? user.language}</td>
                  <td className="hidden px-4 py-3 text-gray-400 lg:table-cell">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {!isSelf && (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={deletingId === user.id}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                        title="Delete user"
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
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
