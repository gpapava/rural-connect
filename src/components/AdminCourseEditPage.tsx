"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft, Plus, Trash2, Save,
  FileText, BookOpen, HelpCircle, Video, Package, ExternalLink,
  UploadCloud, CheckCircle, Loader2, FolderOpen, Pencil, X,
  ChevronUp, ChevronDown,
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
  description: string | null;
  order: number;
  topicId: string | null;
};

type Topic = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
};

type Module = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number | null;
  imageUrl: string | null;
  lessons: Lesson[];  // unassigned lessons (topicId = null)
  topics: Topic[];
};

const TYPE_LABEL_KEY: Record<LessonType, string> = {
  TEXT: "types.TEXT",
  PDF: "types.PDF",
  VIDEO: "types.VIDEO",
  QUIZ: "types.QUIZ",
  SCORM: "types.SCORM",
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
  const t = useTranslations("admin.courseEditor");
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
      if (!res.ok) setError(data.error ?? t("uploadFailed"));
      else { onChange(data.url ?? data.launchUrl); setUploaded(true); }
    } catch {
      setError(t("uploadFailedRetry"));
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
          <><Loader2 className="h-8 w-8 animate-spin text-[#1a73e8]" /><p className="text-sm font-medium text-gray-600">{t("uploading")}</p></>
        ) : uploaded ? (
          <><CheckCircle className="h-8 w-8 text-green-500" /><p className="text-sm font-medium text-green-700">{t("uploadedSuccess", { label })}</p><p className="text-xs text-gray-400">{t("clickToReplace")}</p></>
        ) : (
          <><UploadCloud className="h-8 w-8 text-gray-400" /><div className="text-center"><p className="text-sm font-medium text-gray-700">{t("dragDrop", { label })}</p><p className="text-xs text-gray-400 mt-1">{t("orClickBrowse")}</p></div></>
        )}
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t("urlAutoFilled")}</label>
        <input value={content} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input w-full text-xs" />
      </div>
      {content && (
        <a href={getTestUrl ? getTestUrl(content) : content} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#1a73e8] hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> {t("testUrl")}
        </a>
      )}
    </div>
  );
}

function LessonContentEditor({ type, content, onChange }: { type: LessonType; content: string; onChange: (v: string) => void }) {
  const t = useTranslations("admin.courseEditor");
  if (type === "TEXT") return <RichTextEditor content={content} onChange={onChange} />;
  if (type === "VIDEO") {
    const embedUrl = getVideoEmbed(content);
    return (
      <div className="space-y-2">
        <input value={content} onChange={(e) => onChange(e.target.value)} placeholder={t("videoUrlPlaceholder")} className="input w-full" />
        {embedUrl && <div className="aspect-video overflow-hidden rounded-lg bg-black"><iframe src={embedUrl} className="h-full w-full" allowFullScreen /></div>}
      </div>
    );
  }
  if (type === "PDF") return <FileUploader content={content} onChange={onChange} accept=".pdf,application/pdf" endpoint="/api/admin/pdf/upload" label="PDF" placeholder={t("pdfPlaceholder")} />;
  if (type === "QUIZ") return <QuizBuilder value={content} onChange={onChange} />;
  if (type === "SCORM") return <FileUploader content={content} onChange={onChange} accept=".zip" endpoint="/api/admin/scorm/upload" label="SCORM .zip" placeholder={t("scormPlaceholder")} getTestUrl={(u) => `/scorm-player.html?url=${encodeURIComponent(u)}`} />;
  return null;
}

function TypeSelector({ value, onChange }: { value: LessonType; onChange: (t: LessonType) => void }) {
  const tr = useTranslations("admin.courseEditor");
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {ALL_TYPES.map((t) => (
        <button key={t} type="button" onClick={() => onChange(t)}
          className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-xs font-medium transition-colors ${
            value === t ? "border-[#1a73e8] bg-[#1a73e8]/5 text-[#1a73e8]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          {TYPE_ICONS[t]}
          {tr(TYPE_LABEL_KEY[t])}
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
  form: { title: string; type: LessonType; content: string; topicId: string | null; description: string };
  topics: Topic[];
  lockedTopicId?: string | null;
  onChange: (patch: Partial<typeof form>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
  submitLabel: string;
  error?: string;
}) {
  const t = useTranslations("admin.courseEditor");
  const showDescription = ["PDF", "VIDEO", "QUIZ"].includes(form.type);
  return (
    <div className="rounded-xl border border-[#1a73e8]/20 bg-blue-50 p-4 space-y-4">
      <input
        value={form.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder={t("lessonTitlePlaceholder")}
        className="input w-full"
      />

      {/* Topic assignment (only show if topics exist and we're not locked to one) */}
      {topics.length > 0 && lockedTopicId === undefined && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">{t("assignToTopic")}</label>
          <select
            value={form.topicId ?? ""}
            onChange={(e) => onChange({ topicId: e.target.value || null })}
            className="input w-full"
          >
            <option value="">{t("noTopicOption")}</option>
            {topics.map((tp) => <option key={tp.id} value={tp.id}>{tp.title}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-700">{t("contentType")}</label>
        <TypeSelector value={form.type} onChange={(ty) => onChange({ type: ty, content: "" })} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-700">{t("content")}</label>
        <LessonContentEditor type={form.type} content={form.content} onChange={(v) => onChange({ content: v })} />
      </div>
      {showDescription && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            {t("lessonDescription")} <span className="text-gray-400">{t("lessonDescriptionNote")}</span>
          </label>
          <RichTextEditor
            content={form.description}
            onChange={(html) => onChange({ description: html })}
            placeholder={t("lessonDescriptionPlaceholder")}
          />
        </div>
      )}
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button onClick={onSubmit} disabled={saving} className="btn-primary text-xs py-1.5 px-3">
          {saving ? t("saving") : submitLabel}
        </button>
        <button onClick={onCancel} className="btn-secondary text-xs py-1.5 px-3">{t("cancel")}</button>
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
  onMoveUp,
  onMoveDown,
}: {
  lesson: Lesson;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const t = useTranslations("admin.courseEditor");
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="flex flex-col gap-0.5 flex-shrink-0">
        <button
          onClick={onMoveUp}
          disabled={!onMoveUp}
          className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          title={t("moveUp")}
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={!onMoveDown}
          className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          title={t("moveDown")}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
      <span className="text-gray-400 flex-shrink-0">{TYPE_ICONS[lesson.type]}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
        <p className="text-xs text-gray-400">{t(TYPE_LABEL_KEY[lesson.type])}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="btn-secondary py-1 px-2 text-xs">{t("editLesson")}</button>
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
  const t = useTranslations("admin.courseEditor");
  const router = useRouter();
  const [course, setCourse] = useState<Module>(initial);
  const [courseForm, setCourseForm] = useState({
    title: initial.title,
    description: initial.description,
    category: initial.category,
    duration: initial.duration?.toString() ?? "",
    imageUrl: initial.imageUrl ?? "",
  });
  const [savingCourse, setSavingCourse] = useState(false);
  const [courseSaved, setCourseSaved] = useState(false);

  // topic state
  const [addingTopic, setAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [savingTopic, setSavingTopic] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicTitle, setEditingTopicTitle] = useState("");
  const [editingTopicDescription, setEditingTopicDescription] = useState("");
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);

  // lesson state
  type LessonFormData = { title: string; type: LessonType; content: string; topicId: string | null; description: string };
  // lessonFormContext: false=closed, null=add unassigned, string=add to topic
  const [lessonFormContext, setLessonFormContext] = useState<string | null | false>(false);
  const [lessonForm, setLessonForm] = useState<LessonFormData>({ title: "", type: "TEXT", content: "", topicId: null, description: "" });
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
      body: JSON.stringify({ title: newTopicTitle, description: newTopicDescription || null }),
    });
    if (res.ok) {
      const { topic } = await res.json();
      setCourse((c) => ({ ...c, topics: [...c.topics, topic] }));
      setNewTopicTitle("");
      setNewTopicDescription("");
      setAddingTopic(false);
    }
    setSavingTopic(false);
  };

  const saveTopic = async (topicId: string) => {
    if (!editingTopicTitle.trim()) return;
    const res = await fetch(`/api/admin/courses/${course.id}/topics/${topicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTopicTitle, description: editingTopicDescription || null }),
    });
    if (res.ok) {
      setCourse((c) => ({
        ...c,
        topics: c.topics.map((t) =>
          t.id === topicId
            ? { ...t, title: editingTopicTitle, description: editingTopicDescription || null }
            : t
        ),
      }));
      setEditingTopicId(null);
    }
  };

  const deleteTopic = async (topicId: string) => {
    if (!confirm(t("confirmDeleteTopic"))) return;
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
    setLessonForm({ title: "", type: "TEXT", content: "", topicId: topicId ?? null, description: "" });
    setEditingLesson(null);
  };

  const addLesson = async () => {
    if (!lessonForm.title.trim() || !lessonForm.content) {
      setLessonError(t("fillTitleContent"));
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
        setLessonForm({ title: "", type: "TEXT", content: "", topicId: null, description: "" });
        setLessonFormContext(false);
      } else {
        const data = await res.json().catch(() => ({}));
        setLessonError(data.error ?? t("saveLessonFailed"));
      }
    } catch {
      setLessonError(t("networkError"));
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
          description: editingLesson.description,
        }),
      });
      if (res.ok) {
        const { lesson } = await res.json();
        setCourse((c) => addLessonToModule(removeLessonFromModule(c, lesson.id), lesson));
        setEditingLesson(null);
      } else {
        const data = await res.json().catch(() => ({}));
        setLessonError(data.error ?? t("saveLessonFailed"));
      }
    } catch {
      setLessonError(t("networkError"));
    } finally {
      setSavingLesson(false);
    }
  };

  const deleteLesson = async (id: string) => {
    if (!confirm(t("confirmDeleteLesson"))) return;
    setDeletingId(id);
    await fetch(`/api/admin/courses/${course.id}/lessons/${id}`, { method: "DELETE" });
    setCourse((c) => removeLessonFromModule(c, id));
    setDeletingId(null);
  };

  const moveLesson = async (lessonId: string, topicId: string | null, direction: "up" | "down") => {
    const list = topicId ? course.topics.find((t) => t.id === topicId)?.lessons ?? [] : course.lessons;
    const idx = list.findIndex((l) => l.id === lessonId);
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || targetIdx < 0 || targetIdx >= list.length) return;

    const a = list[idx];
    const b = list[targetIdx];

    const swap = (arr: Lesson[]) => {
      const next = [...arr];
      const i = next.findIndex((l) => l.id === lessonId);
      const ti = direction === "up" ? i - 1 : i + 1;
      if (i < 0 || ti < 0 || ti >= next.length) return arr;
      const aOrder = next[i].order;
      next[i] = { ...next[i], order: next[ti].order };
      next[ti] = { ...next[ti], order: aOrder };
      return next.sort((x, y) => x.order - y.order);
    };

    setCourse((c) => {
      if (topicId) {
        return { ...c, topics: c.topics.map((t) => t.id === topicId ? { ...t, lessons: swap(t.lessons) } : t) };
      }
      return { ...c, lessons: swap(c.lessons) };
    });

    await Promise.all([
      fetch(`/api/admin/courses/${course.id}/lessons/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: b.order }),
      }),
      fetch(`/api/admin/courses/${course.id}/lessons/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: a.order }),
      }),
    ]);
  };

  const startEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonFormContext(false);
  };

  const totalLessons = course.topics.reduce((acc, t) => acc + t.lessons.length, 0) + course.lessons.length;

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => router.push(`/${locale}/admin/courses`)} className="btn-secondary mb-6">
        <ArrowLeft className="h-4 w-4" /> {t("backToCourses")}
      </button>

      {/* Course details */}
      <div className="card mb-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">{t("courseDetails")}</h2>
        <div className="space-y-3">
          <input
            value={courseForm.title}
            onChange={(e) => setCourseForm((f) => ({ ...f, title: e.target.value }))}
            placeholder={t("courseTitlePlaceholder")}
            className="input w-full"
          />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">{t("description")}</label>
            <RichTextEditor
              content={courseForm.description}
              onChange={(html) => setCourseForm((f) => ({ ...f, description: html }))}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={courseForm.category} onChange={(e) => setCourseForm((f) => ({ ...f, category: e.target.value }))} placeholder={t("category")} className="input" />
            <input value={courseForm.duration} onChange={(e) => setCourseForm((f) => ({ ...f, duration: e.target.value }))} placeholder={t("durationMinutes")} type="number" className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">{t("featuredImageUrl")} <span className="text-gray-400">({t("optional")})</span></label>
            <input
              value={courseForm.imageUrl}
              onChange={(e) => setCourseForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder={t("featuredImagePlaceholder")}
              className="input w-full"
            />
            {courseForm.imageUrl && (
              <img
                src={courseForm.imageUrl}
                alt={t("imagePreviewAlt")}
                className="mt-2 h-24 w-full rounded-lg object-cover border border-gray-200"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </div>
          <button onClick={saveCourse} disabled={savingCourse} className="btn-primary">
            <Save className="h-4 w-4" />
            {courseSaved ? t("saved") : savingCourse ? t("saving") : t("saveChanges")}
          </button>
        </div>
      </div>

      {/* Topics management */}
      <div className="card mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            {t("topics", { count: course.topics.length })}
          </h2>
          <button onClick={() => { setAddingTopic(true); setNewTopicTitle(""); }} className="btn-primary py-1.5 px-3 text-xs">
            <Plus className="h-3.5 w-3.5" /> {t("addTopic")}
          </button>
        </div>

        {course.topics.length === 0 && !addingTopic && (
          <p className="text-sm text-gray-400 py-2">
            {t("noTopics")}
          </p>
        )}

        <div className="space-y-2">
          {course.topics.map((topic) => (
            <div key={topic.id} className="rounded-lg border border-gray-100 bg-gray-50">
              {editingTopicId === topic.id ? (
                <div className="p-3 space-y-3">
                  <input
                    autoFocus
                    value={editingTopicTitle}
                    onChange={(e) => setEditingTopicTitle(e.target.value)}
                    placeholder={t("topicTitlePlaceholder")}
                    className="input w-full py-1 text-sm"
                  />
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">{t("topicDescription")}</label>
                    <RichTextEditor
                      content={editingTopicDescription}
                      onChange={setEditingTopicDescription}
                      placeholder={t("topicDescriptionPlaceholder")}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveTopic(topic.id)} disabled={savingTopic} className="btn-primary py-1 px-3 text-xs">
                      {savingTopic ? t("saving") : t("save")}
                    </button>
                    <button onClick={() => setEditingTopicId(null)} className="btn-secondary py-1 px-2 text-xs"><X className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3">
                  <FolderOpen className="h-4 w-4 flex-shrink-0 text-[#1a73e8] mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">{topic.title}</p>
                    <p className="text-xs text-gray-400">{t("lessonsInTopic", { count: topic.lessons.length })}</p>
                    {topic.description && (
                      <div
                        className="mt-1.5 text-xs text-gray-500 prose prose-xs max-w-none line-clamp-2 [&_img]:hidden"
                        dangerouslySetInnerHTML={{ __html: topic.description }}
                      />
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => { setEditingTopicId(topic.id); setEditingTopicTitle(topic.title); setEditingTopicDescription(topic.description ?? ""); }}
                      className="btn-secondary py-1 px-2 text-xs"
                      title={t("editTopic")}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTopic(topic.id)}
                      disabled={deletingTopicId === topic.id}
                      className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100 disabled:opacity-50"
                      title={t("deleteTopic")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {addingTopic && (
          <div className="mt-3 space-y-3 rounded-xl border border-[#1a73e8]/20 bg-blue-50 p-4">
            <input
              autoFocus
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder={t("topicTitlePlaceholder")}
              className="input w-full"
            />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">{t("topicDescription")}</label>
              <RichTextEditor
                content={newTopicDescription}
                onChange={setNewTopicDescription}
                placeholder={t("topicDescriptionPlaceholder")}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={createTopic} disabled={savingTopic} className="btn-primary px-3 text-xs py-1.5">
                {savingTopic ? t("saving") : t("saveTopic")}
              </button>
              <button onClick={() => { setAddingTopic(false); setNewTopicTitle(""); setNewTopicDescription(""); }} className="btn-secondary px-3 text-xs py-1.5">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lessons */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">{t("lessons", { count: totalLessons })}</h2>
          <button
            onClick={() => { openAddLesson(null); }}
            className="btn-primary py-1.5 px-3 text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> {t("addLesson")}
          </button>
        </div>

        {/* Add lesson form (when opened via top button — allows topic selection) */}
        {lessonFormContext === null && editingLesson === null && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-700 mb-3">{t("newLesson")}</h3>
            <LessonForm
              form={lessonForm}
              topics={course.topics}
              onChange={(patch) => setLessonForm((f) => ({ ...f, ...patch }))}
              onSubmit={addLesson}
              onCancel={() => { setLessonError(""); setLessonFormContext(false); }}
              saving={savingLesson}
              submitLabel={t("addLesson")}
              error={lessonError}
            />
          </div>
        )}

        {totalLessons === 0 && lessonFormContext === false && (
          <p className="text-center text-sm text-gray-400 py-6">{t("noLessons")}</p>
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
                <Plus className="h-3.5 w-3.5" /> {t("addLessonShort")}
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
                  submitLabel={t("addLesson")}
                  error={lessonError}
                />
              </div>
            )}

            {topic.lessons.length === 0 && lessonFormContext !== topic.id && (
              <p className="text-xs text-gray-400 py-2 pl-2">{t("noLessonsInTopic")}</p>
            )}

            <div className="space-y-2">
              {topic.lessons.map((lesson, idx) => (
                <div key={lesson.id}>
                  {editingLesson?.id === lesson.id ? (
                    <LessonForm
                      form={{ title: editingLesson.title, type: editingLesson.type, content: editingLesson.content, topicId: editingLesson.topicId, description: editingLesson.description ?? "" }}
                      topics={course.topics}
                      onChange={(patch) => setEditingLesson((l) => l && ({ ...l, ...patch }))}
                      onSubmit={saveLesson}
                      onCancel={() => { setLessonError(""); setEditingLesson(null); }}
                      saving={savingLesson}
                      submitLabel={t("save")}
                      error={lessonError}
                    />
                  ) : (
                    <LessonRow
                      lesson={lesson}
                      onEdit={() => startEditLesson(lesson)}
                      onDelete={() => deleteLesson(lesson.id)}
                      deleting={deletingId === lesson.id}
                      onMoveUp={idx > 0 ? () => moveLesson(lesson.id, topic.id, "up") : undefined}
                      onMoveDown={idx < topic.lessons.length - 1 ? () => moveLesson(lesson.id, topic.id, "down") : undefined}
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
                <h3 className="text-sm font-semibold text-gray-500">{t("unassigned")}</h3>
                <span className="text-xs text-gray-400">({course.lessons.length})</span>
              </div>
            )}
            <div className="space-y-2">
              {course.lessons.map((lesson, idx) => (
                <div key={lesson.id}>
                  {editingLesson?.id === lesson.id ? (
                    <LessonForm
                      form={{ title: editingLesson.title, type: editingLesson.type, content: editingLesson.content, topicId: editingLesson.topicId, description: editingLesson.description ?? "" }}
                      topics={course.topics}
                      onChange={(patch) => setEditingLesson((l) => l && ({ ...l, ...patch }))}
                      onSubmit={saveLesson}
                      onCancel={() => { setLessonError(""); setEditingLesson(null); }}
                      saving={savingLesson}
                      submitLabel={t("save")}
                      error={lessonError}
                    />
                  ) : (
                    <LessonRow
                      lesson={lesson}
                      onEdit={() => startEditLesson(lesson)}
                      onDelete={() => deleteLesson(lesson.id)}
                      deleting={deletingId === lesson.id}
                      onMoveUp={idx > 0 ? () => moveLesson(lesson.id, null, "up") : undefined}
                      onMoveDown={idx < course.lessons.length - 1 ? () => moveLesson(lesson.id, null, "down") : undefined}
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
