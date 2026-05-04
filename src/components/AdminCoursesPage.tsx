"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, BookOpen, Pencil, Trash2, Clock, FileText } from "lucide-react";

type Module = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number | null;
  order: number;
  _count: { lessons: number };
};

interface Props {
  modules: Module[];
  locale: string;
}

export default function AdminCoursesPage({ modules: initial, locale }: Props) {
  const router = useRouter();
  const [modules, setModules] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", duration: "" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: "", description: "", category: "", duration: "" });
      setShowForm(false);
      router.refresh();
      const data = await res.json();
      setModules((prev) => [...prev, { ...data.module, _count: { lessons: 0 } }]);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course and all its lessons?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    setModules((prev) => prev.filter((m) => m.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-sm text-gray-500">{modules.length} courses in the library</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          New Course
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">New Course</h2>
          <div className="space-y-3">
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Course title *"
              className="input w-full"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description *"
              rows={3}
              className="input w-full resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Category (e.g. Digital Skills)"
                className="input"
              />
              <input
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="Duration (minutes)"
                type="number"
                className="input"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={saving} className="btn-primary">
                {saving ? "Creating…" : "Create Course"}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {modules.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">No courses yet. Create your first one.</p>
          </div>
        ) : (
          modules.map((module) => (
            <div key={module.id} className="card flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#1a73e8]/10">
                <BookOpen className="h-5 w-5 text-[#1a73e8]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 truncate">{module.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-500">{module.category}</span>
                  {module.duration && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" /> {module.duration} min
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <FileText className="h-3 w-3" /> {module._count.lessons} lessons
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/${locale}/admin/courses/${module.id}`)}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(module.id)}
                  disabled={deletingId === module.id}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
