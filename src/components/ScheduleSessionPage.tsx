"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Users, User, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type NeetUser = {
  id: string;
  name: string;
  email: string;
  country: string | null;
};

interface ScheduleSessionPageProps {
  locale: string;
}

export default function ScheduleSessionPage({ locale }: ScheduleSessionPageProps) {
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<NeetUser[]>([]);
  const [myStudents, setMyStudents] = useState<NeetUser[]>([]);
  const [showMyStudentsOnly, setShowMyStudentsOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<NeetUser | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const [allRes, myRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/users?myStudents=true"),
        ]);
        const allData = await allRes.json();
        const myData = await myRes.json();
        setAllUsers(allData.users ?? []);
        setMyStudents(myData.users ?? []);
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  const displayedUsers = showMyStudentsOnly ? myStudents : allUsers;

  const filteredUsers = displayedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !date || !time) return;

    setSubmitting(true);
    setError("");

    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ neetUserId: selectedUser.id, scheduledAt, note }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to schedule session");
        return;
      }

      router.push(`/${locale}/counseling`);
    } catch {
      setError("Failed to schedule session. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Schedule Video Session</h1>
        <p className="mt-1 text-sm text-gray-500">
          Select a student, choose a date and time, and send them an invitation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student selection */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#1a73e8]" />
              Select Student
            </h2>
            <button
              type="button"
              onClick={() => setShowMyStudentsOnly((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                showMyStudentsOnly
                  ? "border-[#1a73e8] bg-blue-50 text-[#1a73e8]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              <User className="h-3.5 w-3.5" />
              My Students Only
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            />
          </div>

          {loadingUsers ? (
            <p className="py-4 text-center text-sm text-gray-400">Loading students...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">No students found</p>
          ) : (
            <div className="max-h-56 space-y-1 overflow-y-auto">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                    selectedUser?.id === user.id
                      ? "border-[#1a73e8] bg-blue-50"
                      : "border-transparent hover:bg-gray-50"
                  )}
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1a73e8]/10 text-xs font-bold text-[#1a73e8]">
                    {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                  {user.country && (
                    <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      {user.country}
                    </span>
                  )}
                  {selectedUser?.id === user.id && (
                    <span className="ml-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#1a73e8]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 flex items-center gap-2">
            <CalendarPlus className="h-4 w-4 text-[#1a73e8]" />
            Date & Time
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                min={minDate}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
          </div>
        </div>

        {/* Optional note */}
        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Note (optional)</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for the student about this session..."
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedUser || !date || !time || submitting}
            className="btn-primary flex-1"
          >
            <CalendarPlus className="h-4 w-4" />
            {submitting ? "Scheduling..." : "Send Invitation"}
          </button>
        </div>
      </form>
    </div>
  );
}
