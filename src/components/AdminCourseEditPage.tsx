"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Trash2, Save,
  FileText, BookOpen, HelpCircle, Video, GripVertical, Package, ExternalLink,
  UploadCloud, CheckCircle, Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";
import QuizBuilder from "./QuizBuilder";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false });

type LessonType = "TEXT" | "PDF" | "VIDEO" | "QUIZ" | "SCORM";

type Lesson = { id: string; title: string; type: LessonType; content: string; order: number };
type Module = { id: string; title: string; description: string; category: string; duration: number | null; lessons: Lesson[] };

const TYPE_LABELS: Record<LessonType, string> = {
  TEXT: "Rich Text",
  PDF: "PDF (link)",
  VIDEO: "Video (YouTube / Vimeo)",
  QUIZ: "Quiz",
  SCORM: "SCORM Package",
};

const TYPE_ICONS: Record<LessonType, React.ReactNode> = {
  TEXT: <BookOpen className="h-4 w-4" />,
  PDF: <FileText className="h-4 w-4" />,
  VIDEO: <Video className="h-4 w-4" />,
  QUIZ: <HelpCircle className="h-4 w-4" />,
  SCORM: <Package className="h-4 w-4" />,
};

const ALL_TYPES: LessonType[] = ["TEXT", "VIDEO", "PDF", "QUIZ", "SCORM"];

function getVideoEmbed(url: string) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

function ScormUploader({ content, onChange }: { content: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File) => {
    if (!file.name.endsWith(".zip")) {
      setError("Please select a .zip file.");
      return;
    }
    setUploading(true);
    setError("");
    setUploaded(false);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/scorm/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
      } else {
        onChange(data.launchUrl);
        setUploaded(true);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${
          dragging
            ? "border-[#1a73e8] bg-blue-50"
            : "border-gray-200 bg-gray-50 hover:border-[#1a73e8]/50 hover:bg-blue-50/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
        />
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-[#1a73e8]" />
            <p className="text-sm font-medium text-gray-600">Uploading & extracting…</p>
          </>
        ) : uploaded ? (
          <>
            <CheckCircle className="h-8 w-8 text-green-500" />
            <p className="text-sm font-medium text-green-700">Package uploaded successfully</p>
            <p className="text-xs text-gray-400">Click or drag to replace</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Drag & drop your SCORM .zip here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse</p>
            </div>
          </>
        )}
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      {/* Launch URL (auto-filled after upload, editable manually) */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Launch URL (auto-filled on upload)</label>
        <input
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/scorm/my-course/index.html"
          className="input w-full text-xs"
        />
      </div>

      {content && (
        <a href={content} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#1a73e8] hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> Test launch URL
        </a>
      )}
    </div>
  );
}

function LessonContentEditor({
  type, content, onChange,
}: { type: LessonType; content: string; onChange: (v: string) => void }) {
  if (type === "TEXT") {
    return <RichTextEditor content={content} onChange={onChange} />;
  }
  if (type === "VIDEO") {
    const embedUrl = getVideoEmbed(content);
    return (
      <div className="space-y-2">
        <input
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste YouTube or Vimeo URL"
          className="input w-full"
        />
        {embedUrl && (
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
            <iframe src={embedUrl} className="h-full w-full" allowFullScreen />
          </div>
        )}
      </div>
    );
  }
  if (type === "PDF") {
    return (
      <div className="space-y-2">
        <input
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste public PDF link (Google Drive, Dropbox, etc.)"
          className="input w-full"
        />
        {content && (
          <p className="text-xs text-gray-500">
            Make sure the link is publicly accessible.{" "}
            <a href={content} target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] underline">
              Test link
            </a>
          </p>
        )}
      </div>
    );
  }
  if (type === "QUIZ") {
    return <QuizBuilder value={content} onChange={onChange} />;
  }
  if (type === "SCORM") {
    return <ScormUploader content={content} onChange={onChange} />;
  }
  return null;
}

function TypeSelector({ value, onChange }: { value: LessonType; onChange: (t: LessonType) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {ALL_TYPES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-xs font-medium transition-colors ${
            value === t
              ? "border-[#1a73e8] bg-[#1a73e8]/5 text-[#1a73e8]"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          {TYPE_ICONS[t]}
          {TYPE_LABELS[t]}
        </button>
      ))}
    </div>
  );
}

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
  const [lessonForm, setLessonForm] = useState<{ title: string; type: LessonType; content: string }>({
    title: "", type: "TEXT", content: "",
  });
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
    if (!lessonForm.title.trim() || !lessonForm.content) return;
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
      body: JSON.stringify({
        title: editingLesson.title,
        type: editingLesson.type,
        content: editingLesson.content,
      }),
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
          <h2 className="text-sm font-semibold text-gray-900">
            Lessons ({course.lessons.length})
          </h2>
          <button onClick={() => { setShowLessonForm(true); setEditingLesson(null); }} className="btn-primary py-1.5 px-3 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Lesson
          </button>
        </div>

        {/* New lesson form */}
        {showLessonForm && (
          <div className="mb-6 rounded-xl border border-[#1a73e8]/20 bg-blue-50 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">New Lesson</h3>
            <input
              value={lessonForm.title}
              onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Lesson title *"
              className="input w-full"
            />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Content type</label>
              <TypeSelector
                value={lessonForm.type}
                onChange={(t) => setLessonForm((f) => ({ ...f, type: t, content: "" }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Content</label>
              <LessonContentEditor
                type={lessonForm.type}
                content={lessonForm.content}
                onChange={(v) => setLessonForm((f) => ({ ...f, content: v }))}
              />
            </div>
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

        {/* Lesson list */}
        {course.lessons.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">No lessons yet.</p>
        ) : (
          <div className="space-y-2">
            {course.lessons.map((lesson) => (
              <div key={lesson.id}>
                {editingLesson?.id === lesson.id ? (
                  <div className="rounded-xl border border-[#1a73e8]/20 bg-blue-50 p-4 space-y-4">
                    <input
                      value={editingLesson.title}
                      onChange={(e) => setEditingLesson((l) => l && ({ ...l, title: e.target.value }))}
                      className="input w-full"
                      placeholder="Lesson title"
                    />
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">Content type</label>
                      <TypeSelector
                        value={editingLesson.type}
                        onChange={(t) => setEditingLesson((l) => l && ({ ...l, type: t, content: "" }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">Content</label>
                      <LessonContentEditor
                        type={editingLesson.type}
                        content={editingLesson.content}
                        onChange={(v) => setEditingLesson((l) => l && ({ ...l, content: v }))}
                      />
                    </div>
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
                    <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-300" />
                    <span className="text-gray-400 flex-shrink-0">{TYPE_ICONS[lesson.type]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
                      <p className="text-xs text-gray-400">{TYPE_LABELS[lesson.type]}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingLesson(lesson); setShowLessonForm(false); }}
                        className="btn-secondary py-1 px-2 text-xs"
                      >
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
