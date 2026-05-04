"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, FileText, BookOpen, HelpCircle } from "lucide-react";
import { LessonType } from "@prisma/client";

type Lesson = { id: string; title: string; type: LessonType; content: string; order: number };
type Module = { id: string; title: string; description: string; category: string; duration: number | null; lessons: Lesson[] };

const lessonTypeIcons: Record<LessonType, React.ReactNode> = {
  TEXT: <BookOpen className="h-4 w-4" />,
  PDF: <FileText className="h-4 w-4" />,
  QUIZ: <HelpCircle className="h-4 w-4" />,
};

export default function AdminCourseEditPage({ module: initial, locale }: { module: Module; locale: string }) {
  const router = useRouter();
  const [course, setCourse] = useState(initial);
  const [courseForm, setCourseForm] = useState({
    title: initial.title,
    description: initial.description,
    category: initial.category,
    duration: initial.duration?.toString() ?? "",
  });
  const [savingCourse, setSavingCourse] = useState(false);
  const [courseSaved, setCourseSaved] = useState(false);

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: "", type: "TEXT" as LessonType, content: "" });
  const [savingLesson, setSavingLesson] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const saveCourse = async () => {
    setSavingCourse(true);
    await fetch(`/api/admin/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseForm),
    });
    setSavingCourse(false);
    setCourseSaved(true);
    setTimeout(() => setCourseSaved(false), 2000);
  };

  const addLesson = async () => {
    if (!lessonForm.title.trim() || !lessonForm.content.trim()) return;
    setSavingLesson(true);
    const res = await fetch(`/api/admin/courses/${course.id}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lessonForm),
    });
    if (res.ok) {
      const { lesson } = await res.json();
      setCourse((c) => ({ ...c, lessons: [...c.lessons, lesson] }));
      setLessonForm({ title: "", type: "TEXT", content: "" });
      setShowLessonForm(false);
    }
    setSavingLesson(false);
  };

  const saveLesson = async () => {
    if (!editingLesson) return;
    setSavingLesson(true);
    const res = await fetch(`/api/admin/courses/${course.id}/lessons/${editingLesson.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingLesson.title, type: editingLesson.type, content: editingLesson.content }),
    });
    if (res.ok) {
      const { lesson } = await res.json();
      setCourse((c) => ({ ...c, lessons: c.lessons.map((l) => (l.id === lesson.id ? lesson : l)) }));
      setEditingLesson(null);
    }
    setSavingLesson(false);
  };

  const deleteLesson = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/courses/${course.id}/lessons/${id}`, { method: "DELETE" });
    setCourse((c) => ({ ...c, lessons: c.lessons.filter((l) => l.id !== id) }));
    setDeletingId(null);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => router.push(`/${locale}/admin/courses`)} className="btn-secondary mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </button>

      {/* Course details */}
      <div className="card mb-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Course Details</h2>
        <div className="space-y-3">
          <input
            value={courseForm.title}
            onChange={(e) => setCourseForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Course title"
            className="input w-full"
          />
          <textarea
            value={courseForm.description}
            onChange={(e) => setCourseForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Description"
            rows={3}
            className="input w-full resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={courseForm.category}
              onChange={(e) => setCourseForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="Category"
              className="input"
            />
            <input
              value={courseForm.duration}
              onChange={(e) => setCourseForm((f) => ({ ...f, duration: e.target.value }))}
              placeholder="Duration (minutes)"
              type="number"
              className="input"
            />
          </div>
          <button onClick={saveCourse} disabled={savingCourse} className="btn-primary">
            <Save className="h-4 w-4" />
            {courseSaved ? "Saved!" : savingCourse ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Lessons */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Lessons ({course.lessons.length})</h2>
          <button onClick={() => setShowLessonForm(true)} className="btn-primary py-1.5 px-3 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Lesson
          </button>
        </div>

        {showLessonForm && (
          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
            <input
              value={lessonForm.title}
              onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Lesson title *"
              className="input w-full"
            />
            <select
              value={lessonForm.type}
              onChange={(e) => setLessonForm((f) => ({ ...f, type: e.target.value as LessonType }))}
              className="input w-full"
            >
              <option value="TEXT">Text</option>
              <option value="PDF">PDF</option>
              <option value="QUIZ">Quiz</option>
            </select>
            <textarea
              value={lessonForm.content}
              onChange={(e) => setLessonForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Content *"
              rows={5}
              className="input w-full resize-none font-mono text-xs"
            />
            <div className="flex gap-2">
              <button onClick={addLesson} disabled={savingLesson} className="btn-primary text-xs py-1.5 px-3">
                {savingLesson ? "Adding…" : "Add Lesson"}
              </button>
              <button onClick={() => setShowLessonForm(false)} className="btn-secondary text-xs py-1.5 px-3">
                Cancel
              </button>
            </div>
          </div>
        )}

        {course.lessons.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">No lessons yet.</p>
        ) : (
          <div className="space-y-2">
            {course.lessons.map((lesson) => (
              <div key={lesson.id}>
                {editingLesson?.id === lesson.id ? (
                  <div className="rounded-lg border border-[#1a73e8]/30 bg-blue-50 p-4 space-y-3">
                    <input
                      value={editingLesson.title}
                      onChange={(e) => setEditingLesson((l) => l && ({ ...l, title: e.target.value }))}
                      className="input w-full"
                    />
                    <select
                      value={editingLesson.type}
                      onChange={(e) => setEditingLesson((l) => l && ({ ...l, type: e.target.value as LessonType }))}
                      className="input w-full"
                    >
                      <option value="TEXT">Text</option>
                      <option value="PDF">PDF</option>
                      <option value="QUIZ">Quiz</option>
                    </select>
                    <textarea
                      value={editingLesson.content}
                      onChange={(e) => setEditingLesson((l) => l && ({ ...l, content: e.target.value }))}
                      rows={6}
                      className="input w-full resize-none font-mono text-xs"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveLesson} disabled={savingLesson} className="btn-primary text-xs py-1.5 px-3">
                        {savingLesson ? "Saving…" : "Save"}
                      </button>
                      <button onClick={() => setEditingLesson(null)} className="btn-secondary text-xs py-1.5 px-3">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <span className="text-gray-400">{lessonTypeIcons[lesson.type]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
                      <p className="text-xs text-gray-400">{lesson.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingLesson(lesson)} className="btn-secondary py-1 px-2 text-xs">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteLesson(lesson.id)}
                        disabled={deletingId === lesson.id}
                        className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
