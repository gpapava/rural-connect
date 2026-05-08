"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Trash2, Save,
  FileText, BookOpen, HelpCircle, Video, GripVertical, Package, ExternalLink,
  UploadCloud, CheckCircle, Loader2, FolderOpen, Pencil, X,
} from "lucide-react";
import dynamic from "next/dynamic";
import QuizBuilder from "./QuizBuilder";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false });

type LessonType = "TEXT" | "PDF" | "VIDEO" | "QUIZ" | "SCORM";

type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  content: string;
  order: number;
  topicId: string | null;
};

type Topic = {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
};

type Module = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number | null;
  lessons: Lesson[];  // unassigned lessons (topicId = null)
  topics: Topic[];
};

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

// ---- helpers to update course state ----
function removeLessonFromModule(m: Module, lessonId: string): Module {
  return {
    ...m,
    lessons: m.lessons.filter((l) => l.id !== lessonId),
    topics: m.topics.map((t) => ({ ...t, lessons: t.lessons.filter((l) => l.id !== lessonId) })),
  };
}

function addLessonToModule(m: Module, lesson: Lesson): Module {
  if (!lesson.topicId) return { ...m, lessons: [...m.lessons, lesson] };
  return {
    ...m,
    topics: m.topics.map((t) =>
      t.id === lesson.topicId ? { ...t, lessons: [...t.lessons, lesson] } : t
    ),
  };
}

// ---- shared sub-components ----
function FileUploader({
  content, onChange, accept, endpoint, label, placeholder, getTestUrl,
}: {
  content: string;
  onChange: (v: string) => void;
  accept: string;
  endpoint: string;
  label: string;
  placeholder: string;
  getTestUrl?: (url: string) => string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    setUploaded(false);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(endpoint, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Upload failed");
      else { onChange(data.url ?? data.launchUrl); setUploaded(true); }
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
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${
          dragging ? "border-[#1a73e8] bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-[#1a73e8]/50 hover:bg-blue-50/30"
        }`}
      >
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        {uploading ? (
          <><Loader2 className="h-8 w-8 animate-spin text-[#1a73e8]" /><p className="text-sm font-medium text-gray-600">Uploading…</p></>
        ) : uploaded ? (
          <><CheckCircle className="h-8 w-8 text-green-500" /><p className="text-sm font-medium text-green-700">{label} uploaded successfully</p><p className="text-xs text-gray-400">Click or drag to replace</p></>
        ) : (
          <><UploadCloud className="h-8 w-8 text-gray-400" /><div className="text-center"><p className="text-sm font-medium text-gray-700">Drag & drop your {label} here</p><p className="text-xs text-gray-400 mt-1">or click to browse</p></div></>
        )}
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">URL (auto-filled on upload)</label>
        <input value={content} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input w-full text-xs" />
      </div>
      {content && (
        <a href={getTestUrl ? getTestUrl(content) : content} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#1a73e8] hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> Test URL
        </a>
      )}
    </div>
  );
}

function LessonContentEditor({ type, content, onChange }: { type: LessonType; content: string; onChange: (v: string) => void }) {
  if (type === "TEXT") return <RichTextEditor content={content} onChange={onChange} />;
  if (type === "VIDEO") {
    const embedUrl = getVideoEmbed(content);
    return (
      <div className="space-y-2">
        <input value={content} onChange={(e) => onChange(e.target.value)} placeholder="Paste YouTube or Vimeo URL" className="input w-full" />
        {embedUrl && <div className="aspect-video overflow-hidden rounded-lg bg-black"><iframe src={embedUrl} className="h-full w-full" allowFullScreen /></div>}
      </div>
    );
  }
  if (type === "PDF") return <FileUploader content={content} onChange={onChange} accept=".pdf,application/pdf" endpoint="/api/admin/pdf/upload" label="PDF" placeholder="/pdfs/my-document.pdf" />;
  if (type === "QUIZ") return <QuizBuilder value={content} onChange={onChange} />;
  if (type === "SCORM") return <FileUploader content={content} onChange={onChange} accept=".zip" endpoint="/api/admin/scorm/upload" label="SCORM .zip" placeholder="/scorm/my-course/index.html" getTestUrl={(u) => `/scorm-player.html?url=${encodeURIComponent(u)}`} />;
  return null;
}

function TypeSelector({ value, onChange }: { value: LessonType; onChange: (t: LessonType) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {ALL_TYPES.map((t) => (
        <button key={t} type="button" onClick={() => onChange(t)}
          className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-xs font-medium transition-colors ${
            value === t ? "border-[#1a73e8] bg-[#1a73e8]/5 text-[#1a73e8]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          {TYPE_ICONS[t]}
          {TYPE_LABELS[t]}
        </button>
      ))}
    </div>
  );
}

// ---- Lesson inline form ----
function LessonForm({
  form,
  topics,
  lockedTopicId,
  onChange,
  onSubmit,
  onCancel,
  saving,
  submitLabel,
  error,
}: {
  form: { title: string; type: LessonType; content: string; topicId: string | null };
  topics: Topic[];
  lockedTopicId?: string | null;
  onChange: (patch: Partial<typeof form>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
  submitLabel: string;
  error?: string;
}) {
  return (
    <div className="rounded-xl border border-[#1a73e8]/20 bg-blue-50 p-4 space-y-4">
      <input
        value={form.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Lesson title *"
        className="input w-full"
      />

      {/* Topic assignment (only show if topics exist and we're not locked to one) */}
      {topics.length > 0 && lockedTopicId === undefined && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Assign to topic</label>
          <select
            value={form.topicId ?? ""}
            onChange={(e) => onChange({ topicId: e.target.value || null })}
            className="input w-full"
          >
            <option value="">No topic (unassigned)</option>
            {topics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-700">Content type</label>
        <TypeSelector value={form.type} onChange={(t) => onChange({ type: t, content: "" })} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-700">Content</label>
        <LessonContentEditor type={form.type} content={form.content} onChange={(v) => onChange({ content: v })} />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button onClick={onSubmit} disabled={saving} className="btn-primary text-xs py-1.5 px-3">
          {saving ? "Saving…" : submitLabel}
        </button>
        <button onClick={onCancel} className="btn-secondary text-xs py-1.5 px-3">Cancel</button>
      </div>
    </div>
  );
}

// ---- Lesson row ----
function LessonRow({
  lesson,
  onEdit,
  onDelete,
  deleting,
}: {
  lesson: Lesson;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
      <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-300" />
      <span className="text-gray-400 flex-shrink-0">{TYPE_ICONS[lesson.type]}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
        <p className="text-xs text-gray-400">{TYPE_LABELS[lesson.type]}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="btn-secondary py-1 px-2 text-xs">Edit</button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ---- Main component ----
export default function AdminCourseEditPage({ module: initial, locale }: { module: Module; locale: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<Module>(initial);
  const [courseForm, setCourseForm] = useState({
    title: initial.title,
    description: initial.description,
    category: initial.category,
    duration: initial.duration?.toString() ?? "",
  });
  const [savingCourse, setSavingCourse] = useState(false);
  const [courseSaved, setCourseSaved] = useState(false);

  // topic state
  const [addingTopic, setAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [savingTopic, setSavingTopic] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicTitle, setEditingTopicTitle] = useState("");
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);

  // lesson state
  type LessonFormData = { title: string; type: LessonType; content: string; topicId: string | null };
  // lessonFormContext: false=closed, null=add unassigned, string=add to topic
  const [lessonFormContext, setLessonFormContext] = useState<string | null | false>(false);
  const [lessonForm, setLessonForm] = useState<LessonFormData>({ title: "", type: "TEXT", content: "", topicId: null });
  const [savingLesson, setSavingLesson] = useState(false);
  const [lessonError, setLessonError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // ---- course actions ----
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

  // ---- topic actions ----
  const createTopic = async () => {
    if (!newTopicTitle.trim()) return;
    setSavingTopic(true);
    const res = await fetch(`/api/admin/courses/${course.id}/topics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTopicTitle }),
    });
    if (res.ok) {
      const { topic } = await res.json();
      setCourse((c) => ({ ...c, topics: [...c.topics, topic] }));
      setNewTopicTitle("");
      setAddingTopic(false);
    }
    setSavingTopic(false);
  };

  const renameTopic = async (topicId: string) => {
    if (!editingTopicTitle.trim()) return;
    const res = await fetch(`/api/admin/courses/${course.id}/topics/${topicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTopicTitle }),
    });
    if (res.ok) {
      setCourse((c) => ({
        ...c,
        topics: c.topics.map((t) => (t.id === topicId ? { ...t, title: editingTopicTitle } : t)),
      }));
      setEditingTopicId(null);
    }
  };

  const deleteTopic = async (topicId: string) => {
    if (!confirm("Delete this topic? Its lessons will become unassigned.")) return;
    setDeletingTopicId(topicId);
    await fetch(`/api/admin/courses/${course.id}/topics/${topicId}`, { method: "DELETE" });
    setCourse((c) => {
      const topic = c.topics.find((t) => t.id === topicId);
      return {
        ...c,
        topics: c.topics.filter((t) => t.id !== topicId),
        lessons: [...c.lessons, ...(topic?.lessons.map((l) => ({ ...l, topicId: null })) ?? [])],
      };
    });
    setDeletingTopicId(null);
  };

  // ---- lesson actions ----
  const openAddLesson = (topicId: string | null) => {
    setLessonError("");
    setLessonFormContext(topicId ?? null);
    setLessonForm({ title: "", type: "TEXT", content: "", topicId: topicId ?? null });
    setEditingLesson(null);
  };

  const addLesson = async () => {
    if (!lessonForm.title.trim() || !lessonForm.content) {
      setLessonError("Please fill in the title and content before saving.");
      return;
    }
    setLessonError("");
    setSavingLesson(true);
    try {
      const res = await fetch(`/api/admin/courses/${course.id}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonForm),
      });
      if (res.ok) {
        const { lesson } = await res.json();
        setCourse((c) => addLessonToModule(c, lesson));
        setLessonForm({ title: "", type: "TEXT", content: "", topicId: null });
        setLessonFormContext(false);
      } else {
        const data = await res.json().catch(() => ({}));
        setLessonError(data.error ?? "Failed to save lesson. Please try again.");
      }
    } catch {
      setLessonError("Network error. Please try again.");
    } finally {
      setSavingLesson(false);
    }
  };

  const saveLesson = async () => {
    if (!editingLesson) return;
    setLessonError("");
    setSavingLesson(true);
    try {
      const res = await fetch(`/api/admin/courses/${course.id}/lessons/${editingLesson.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingLesson.title,
          type: editingLesson.type,
          content: editingLesson.content,
          topicId: editingLesson.topicId,
        }),
      });
      if (res.ok) {
        const { lesson } = await res.json();
        setCourse((c) => addLessonToModule(removeLessonFromModule(c, lesson.id), lesson));
        setEditingLesson(null);
      } else {
        const data = await res.json().catch(() => ({}));
        setLessonError(data.error ?? "Failed to save lesson. Please try again.");
      }
    } catch {
      setLessonError("Network error. Please try again.");
    } finally {
      setSavingLesson(false);
    }
  };

  const deleteLesson = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/courses/${course.id}/lessons/${id}`, { method: "DELETE" });
    setCourse((c) => removeLessonFromModule(c, id));
    setDeletingId(null);
  };

  const startEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonFormContext(false);
  };

  const totalLessons = course.topics.reduce((acc, t) => acc + t.lessons.length, 0) + course.lessons.length;

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
            <input value={courseForm.category} onChange={(e) => setCourseForm((f) => ({ ...f, category: e.target.value }))} placeholder="Category" className="input" />
            <input value={courseForm.duration} onChange={(e) => setCourseForm((f) => ({ ...f, duration: e.target.value }))} placeholder="Duration (minutes)" type="number" className="input" />
          </div>
          <button onClick={saveCourse} disabled={savingCourse} className="btn-primary">
            <Save className="h-4 w-4" />
            {courseSaved ? "Saved!" : savingCourse ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Topics management */}
      <div className="card mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Topics ({course.topics.length})
          </h2>
          <button onClick={() => { setAddingTopic(true); setNewTopicTitle(""); }} className="btn-primary py-1.5 px-3 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Topic
          </button>
        </div>

        {course.topics.length === 0 && !addingTopic && (
          <p className="text-sm text-gray-400 py-2">
            No topics yet. Add topics to organise your course into sections.
          </p>
        )}

        <div className="space-y-2">
          {course.topics.map((topic, i) => (
            <div key={topic.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <FolderOpen className="h-4 w-4 flex-shrink-0 text-[#1a73e8]" />
              {editingTopicId === topic.id ? (
                <input
                  autoFocus
                  value={editingTopicTitle}
                  onChange={(e) => setEditingTopicTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") renameTopic(topic.id); if (e.key === "Escape") setEditingTopicId(null); }}
                  className="input flex-1 py-1 text-sm"
                />
              ) : (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800">{topic.title}</p>
                  <p className="text-xs text-gray-400">{topic.lessons.length} lesson{topic.lessons.length !== 1 ? "s" : ""}</p>
                </div>
              )}
              <div className="flex gap-1.5 flex-shrink-0">
                {editingTopicId === topic.id ? (
                  <>
                    <button onClick={() => renameTopic(topic.id)} className="btn-primary py-1 px-2 text-xs">Save</button>
                    <button onClick={() => setEditingTopicId(null)} className="btn-secondary py-1 px-2 text-xs"><X className="h-3.5 w-3.5" /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditingTopicId(topic.id); setEditingTopicTitle(topic.title); }} className="btn-secondary py-1 px-2 text-xs" title="Rename">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTopic(topic.id)}
                      disabled={deletingTopicId === topic.id}
                      className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100 disabled:opacity-50"
                      title="Delete topic"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {addingTopic && (
          <div className="mt-3 flex gap-2">
            <input
              autoFocus
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") createTopic(); if (e.key === "Escape") setAddingTopic(false); }}
              placeholder="Topic title *"
              className="input flex-1"
            />
            <button onClick={createTopic} disabled={savingTopic} className="btn-primary px-3 text-xs">
              {savingTopic ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setAddingTopic(false)} className="btn-secondary px-3 text-xs">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lessons */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Lessons ({totalLessons})</h2>
          <button
            onClick={() => { openAddLesson(null); }}
            className="btn-primary py-1.5 px-3 text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Add Lesson
          </button>
        </div>

        {/* Add lesson form (when opened via top button — allows topic selection) */}
        {lessonFormContext === null && editingLesson === null && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-700 mb-3">New Lesson</h3>
            <LessonForm
              form={lessonForm}
              topics={course.topics}
              onChange={(patch) => setLessonForm((f) => ({ ...f, ...patch }))}
              onSubmit={addLesson}
              onCancel={() => { setLessonError(""); setLessonFormContext(false); }}
              saving={savingLesson}
              submitLabel="Add Lesson"
              error={lessonError}
            />
          </div>
        )}

        {totalLessons === 0 && lessonFormContext === false && (
          <p className="text-center text-sm text-gray-400 py-6">No lessons yet.</p>
        )}

        {/* Topics with their lessons */}
        {course.topics.map((topic) => (
          <div key={topic.id} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-[#1a73e8]" />
                <h3 className="text-sm font-semibold text-gray-700">{topic.title}</h3>
                <span className="text-xs text-gray-400">({topic.lessons.length})</span>
              </div>
              <button
                onClick={() => { openAddLesson(topic.id); }}
                className="btn-secondary py-1 px-2 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add lesson
              </button>
            </div>

            {/* Add lesson form for this topic */}
            {lessonFormContext === topic.id && editingLesson === null && (
              <div className="mb-3">
                <LessonForm
                  form={lessonForm}
                  topics={course.topics}
                  lockedTopicId={topic.id}
                  onChange={(patch) => setLessonForm((f) => ({ ...f, ...patch }))}
                  onSubmit={addLesson}
                  onCancel={() => { setLessonError(""); setLessonFormContext(false); }}
                  saving={savingLesson}
                  submitLabel="Add Lesson"
                  error={lessonError}
                />
              </div>
            )}

            {topic.lessons.length === 0 && lessonFormContext !== topic.id && (
              <p className="text-xs text-gray-400 py-2 pl-2">No lessons in this topic yet.</p>
            )}

            <div className="space-y-2">
              {topic.lessons.map((lesson) => (
                <div key={lesson.id}>
                  {editingLesson?.id === lesson.id ? (
                    <LessonForm
                      form={{ title: editingLesson.title, type: editingLesson.type, content: editingLesson.content, topicId: editingLesson.topicId }}
                      topics={course.topics}
                      onChange={(patch) => setEditingLesson((l) => l && ({ ...l, ...patch }))}
                      onSubmit={saveLesson}
                      onCancel={() => { setLessonError(""); setEditingLesson(null); }}
                      saving={savingLesson}
                      submitLabel="Save"
                      error={lessonError}
                    />
                  ) : (
                    <LessonRow
                      lesson={lesson}
                      onEdit={() => startEditLesson(lesson)}
                      onDelete={() => deleteLesson(lesson.id)}
                      deleting={deletingId === lesson.id}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Unassigned lessons */}
        {(course.lessons.length > 0 || (course.topics.length > 0 && lessonFormContext === null)) && (
          <div>
            {course.topics.length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-500">Unassigned</h3>
                <span className="text-xs text-gray-400">({course.lessons.length})</span>
              </div>
            )}
            <div className="space-y-2">
              {course.lessons.map((lesson) => (
                <div key={lesson.id}>
                  {editingLesson?.id === lesson.id ? (
                    <LessonForm
                      form={{ title: editingLesson.title, type: editingLesson.type, content: editingLesson.content, topicId: editingLesson.topicId }}
                      topics={course.topics}
                      onChange={(patch) => setEditingLesson((l) => l && ({ ...l, ...patch }))}
                      onSubmit={saveLesson}
                      onCancel={() => { setLessonError(""); setEditingLesson(null); }}
                      saving={savingLesson}
                      submitLabel="Save"
                      error={lessonError}
                    />
                  ) : (
                    <LessonRow
                      lesson={lesson}
                      onEdit={() => startEditLesson(lesson)}
                      onDelete={() => deleteLesson(lesson.id)}
                      deleting={deletingId === lesson.id}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
