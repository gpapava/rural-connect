"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft, BookOpen, FileText, HelpCircle,
  CheckCircle, ChevronRight, ChevronLeft, ExternalLink, Video, Package, FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

type LessonType = "TEXT" | "PDF" | "VIDEO" | "QUIZ" | "SCORM";

type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  content: string;
  description: string | null;
  order: number;
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
};

type QuizQuestion = {
  id: string;
  type?: "multiple_choice" | "true_false" | "matching";
  text: string;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: boolean;
  pairs?: { id: string; left: string; right: string }[];
};

interface ModuleDetailPageProps {
  module: Module;
  lessons: Lesson[];   // unassigned lessons
  topics: Topic[];
  status: string;
  locale: string;
}

const LESSON_LABEL_KEY: Record<LessonType, string> = {
  TEXT: "types.reading", PDF: "types.pdf", VIDEO: "types.video", QUIZ: "types.quiz", SCORM: "types.scorm",
};

function TextLesson({ content }: { content: string }) {
  return (
    <div
      className="prose prose-sm max-w-none text-gray-700
        prose-headings:text-gray-900 prose-a:text-[#1a73e8]
        prose-blockquote:border-[#1a73e8] prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-lg"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

function VideoLesson({ url }: { url: string }) {
  const t = useTranslations("module");
  const getEmbed = (u: string) => {
    const yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vimeo = u.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return null;
  };
  const embedUrl = getEmbed(url);
  if (!embedUrl) return <p className="text-sm text-gray-500">{t("invalidVideoUrl")}</p>;
  return (
    <div className="aspect-video overflow-hidden rounded-xl bg-black">
      <iframe src={embedUrl} className="h-full w-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
    </div>
  );
}

function PdfLesson({ url }: { url: string }) {
  const t = useTranslations("module");
  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <iframe src={`${url}#toolbar=1&navpanes=0&view=FitH`} className="w-full" style={{ height: "clamp(560px, 74vh, 860px)" }} title={t("pdfDocument")} />
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#1a73e8] hover:underline">
        <ExternalLink className="h-4 w-4" /> {t("openInNewTab")}
      </a>
    </div>
  );
}

// --- Matching question sub-component ---
function MatchingQuestion({
  q,
  matchMap,
  onMatch,
  submitted,
}: {
  q: QuizQuestion;
  matchMap: Record<string, string>;
  onMatch: (pairId: string, value: string) => void;
  submitted: boolean;
}) {
  const t = useTranslations("module");
  const [shuffledRights] = useState<{ id: string; right: string }[]>(() =>
    [...(q.pairs ?? [])].sort(() => Math.random() - 0.5)
  );

  return (
    <div className="space-y-2">
      {(q.pairs ?? []).map((pair) => {
        const selected = matchMap[pair.id] ?? "";
        const isCorrect = selected === pair.right;
        return (
          <div
            key={pair.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-2.5 transition-colors",
              submitted
                ? isCorrect
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
                : "border-gray-200 bg-white"
            )}
          >
            <span className="flex-1 text-sm font-medium text-gray-800">{pair.left}</span>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
            <select
              disabled={submitted}
              value={selected}
              onChange={(e) => onMatch(pair.id, e.target.value)}
              className={cn(
                "flex-1 rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]",
                submitted && isCorrect ? "border-green-300 bg-green-50" :
                submitted && !isCorrect ? "border-red-300 bg-red-50" :
                "border-gray-200 bg-white"
              )}
            >
              <option value="" disabled>{t("quiz.selectMatch")}</option>
              {shuffledRights.map((r) => (
                <option key={r.id} value={r.right}>{r.right}</option>
              ))}
            </select>
            {submitted && !isCorrect && (
              <span className="text-xs text-gray-400 flex-shrink-0 max-w-[80px] truncate" title={pair.right}>
                ✓ {pair.right}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Quiz lesson ---
type AnswerValue = number | boolean | Record<string, string>;

function QuizLesson({ content, onComplete }: { content: string; onComplete: () => void }) {
  const t = useTranslations("module");
  let questions: QuizQuestion[] = [];
  try {
    const parsed = JSON.parse(content);
    questions = parsed.questions ?? [];
  } catch {
    return <p className="text-sm text-red-500">{t("quiz.invalidData")}</p>;
  }

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = (q: QuizQuestion): boolean => {
    const type = q.type ?? "multiple_choice";
    const ans = answers[q.id];
    if (type === "multiple_choice") return ans === q.correctIndex;
    if (type === "true_false") return ans === q.correctAnswer;
    if (type === "matching") {
      const map = ans as Record<string, string> | undefined;
      return (q.pairs ?? []).every((p) => map?.[p.id] === p.right);
    }
    return false;
  };

  const allAnswered = questions.every((q) => {
    const type = q.type ?? "multiple_choice";
    if (type === "matching") {
      const map = answers[q.id] as Record<string, string> | undefined;
      return (q.pairs ?? []).every((p) => map?.[p.id]);
    }
    return answers[q.id] !== undefined;
  });

  const score = submitted ? questions.filter(isCorrect).length : 0;

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    if (score === questions.length) onComplete();
  };

  const setMatchAnswer = (qId: string, pairId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...(prev[qId] as Record<string, string> ?? {}), [pairId]: value },
    }));
  };

  return (
    <div className="space-y-6">
      {submitted && (
        <div className={cn("rounded-xl p-4 text-center", score === questions.length ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200")}>
          <p className={cn("text-lg font-bold", score === questions.length ? "text-green-700" : "text-yellow-700")}>
            {score === questions.length ? t("quiz.perfectScore") : t("quiz.scoreLine", { score, total: questions.length })}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {score === questions.length ? t("quiz.completed") : t("quiz.reviewAndRetry")}
          </p>
          {score < questions.length && (
            <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="mt-3 text-sm font-medium text-[#1a73e8] hover:underline">
              {t("quiz.tryAgain")}
            </button>
          )}
        </div>
      )}

      {questions.map((q, qi) => {
        const type = q.type ?? "multiple_choice";
        return (
          <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-gray-900">{qi + 1}. {q.text}</p>
              <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                {type === "true_false" ? t("quiz.questionType.trueFalse") : type === "matching" ? t("quiz.questionType.matching") : t("quiz.questionType.multipleChoice")}
              </span>
            </div>

            {type === "multiple_choice" && (
              <div className="space-y-2">
                {(q.options ?? []).map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  const isOpt = oi === q.correctIndex;
                  let style = "border-gray-200 bg-gray-50 text-gray-700 hover:border-[#1a73e8]/40";
                  if (submitted) {
                    if (isOpt) style = "border-green-400 bg-green-50 text-green-800";
                    else if (selected) style = "border-red-400 bg-red-50 text-red-700";
                    else style = "border-gray-200 bg-gray-50 text-gray-400";
                  } else if (selected) {
                    style = "border-[#1a73e8] bg-blue-50 text-[#1a73e8]";
                  }
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                      className={cn("w-full text-left rounded-lg border px-4 py-2.5 text-sm transition-all", style)}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {type === "true_false" && (
              <div className="flex gap-3">
                {([true, false] as const).map((val) => {
                  const selected = answers[q.id] === val;
                  const isCorrectOpt = val === q.correctAnswer;
                  let style = "border-gray-200 bg-gray-50 text-gray-700 hover:border-[#1a73e8]/40";
                  if (submitted) {
                    if (isCorrectOpt) style = "border-green-400 bg-green-50 text-green-800";
                    else if (selected) style = "border-red-400 bg-red-50 text-red-700";
                    else style = "border-gray-200 bg-gray-50 text-gray-400";
                  } else if (selected) {
                    style = "border-[#1a73e8] bg-blue-50 text-[#1a73e8]";
                  }
                  return (
                    <button
                      key={String(val)}
                      disabled={submitted}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                      className={cn("flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all", style)}
                    >
                      {val ? t("quiz.true") : t("quiz.false")}
                    </button>
                  );
                })}
              </div>
            )}

            {type === "matching" && (
              <MatchingQuestion
                q={q}
                matchMap={(answers[q.id] as Record<string, string>) ?? {}}
                onMatch={(pairId, value) => setMatchAnswer(q.id, pairId, value)}
                submitted={submitted}
              />
            )}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={handleSubmit} disabled={!allAnswered} className="btn-primary w-full disabled:opacity-50">
          {t("quiz.submitAnswers")}
        </button>
      )}
    </div>
  );
}

function ScormLesson({ url, onComplete }: { url: string; onComplete: () => void }) {
  const t = useTranslations("module");
  const playerUrl = `/scorm-player.html?url=${encodeURIComponent(url)}`;
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50" style={{ height: "clamp(560px, 68vh, 820px)" }}>
        <iframe src={playerUrl} className="h-full w-full border-0" allow="fullscreen" title={t("scormContent")} />
      </div>
      <div className="flex items-center justify-between">
        <a href={playerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#1a73e8] hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> {t("openInNewTab")}
        </a>
        <button onClick={onComplete} className="btn-secondary py-1.5 px-3 text-xs">
          <CheckCircle className="h-3.5 w-3.5" /> {t("markAsComplete")}
        </button>
      </div>
    </div>
  );
}

const LESSON_ICON: Record<LessonType, React.ElementType> = {
  TEXT: BookOpen, PDF: FileText, VIDEO: Video, QUIZ: HelpCircle, SCORM: Package,
};

export default function ModuleDetailPage({ module, lessons, topics, status, locale }: ModuleDetailPageProps) {
  const t = useTranslations("module");
  const router = useRouter();

  const allLessons = useMemo(() => [
    ...topics.flatMap((t) => t.lessons),
    ...lessons,
  ], [topics, lessons]);

  const lessonIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    allLessons.forEach((l, i) => map.set(l.id, i));
    return map;
  }, [allLessons]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const activeLesson = allLessons[activeIndex];

  const activeTopic = useMemo(
    () => topics.find((t) => t.lessons.some((l) => l.id === activeLesson?.id)),
    [topics, activeLesson]
  );
  const isLast = activeIndex === allLessons.length - 1;
  const isFirst = activeIndex === 0;

  const markComplete = (id?: string) => {
    setCompletedLessons((prev) => { const next = new Set(prev); next.add(id ?? activeLesson.id); return next; });
  };

  if (allLessons.length === 0) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <p className="text-gray-500">{t("noLessons")}</p>
        <button onClick={() => router.back()} className="btn-secondary mt-4">
          <ArrowLeft className="h-4 w-4" /> {t("backToLibrary")}
        </button>
      </div>
    );
  }

  const hasTopic = topics.length > 0;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-start gap-4">
        <button onClick={() => router.push(`/${locale}/library`)} className="mt-1 flex-shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#1a73e8] mb-1">{module.category}</p>
          <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
          {module.description && (
            <div
              className="mt-2 max-w-3xl text-base leading-relaxed text-gray-600 [&_a]:text-[#1a73e8] [&_a]:underline [&_p]:mt-2 first:[&_p]:mt-0"
              dangerouslySetInnerHTML={{ __html: module.description }}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
              {hasTopic ? t("topics") : t("lessons")}
            </p>

            {hasTopic ? (
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div key={topic.id}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <FolderOpen className="h-3.5 w-3.5 flex-shrink-0 text-[#1a73e8]" />
                      <p className="text-xs font-semibold text-gray-700 truncate">{topic.title}</p>
                    </div>
                    <div className="space-y-1 pl-1">
                      {topic.lessons.map((lesson) => (
                        <LessonNavButton
                          key={lesson.id}
                          lesson={lesson}
                          isActive={activeIndex === lessonIndexMap.get(lesson.id)}
                          isDone={completedLessons.has(lesson.id)}
                          onClick={() => setActiveIndex(lessonIndexMap.get(lesson.id) ?? 0)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                {lessons.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">{t("other")}</p>
                    <div className="space-y-1">
                      {lessons.map((lesson) => (
                        <LessonNavButton
                          key={lesson.id}
                          lesson={lesson}
                          isActive={activeIndex === lessonIndexMap.get(lesson.id)}
                          isDone={completedLessons.has(lesson.id)}
                          onClick={() => setActiveIndex(lessonIndexMap.get(lesson.id) ?? 0)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {allLessons.map((lesson, i) => (
                  <LessonNavButton
                    key={lesson.id}
                    lesson={lesson}
                    isActive={activeIndex === i}
                    isDone={completedLessons.has(lesson.id)}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-5">
              {activeTopic && (
                <p className="mb-1 text-lg font-bold text-[#1a73e8]">{activeTopic.title}</p>
              )}
              <p className="text-xs text-gray-400 uppercase tracking-wide">{t(LESSON_LABEL_KEY[activeLesson.type])}</p>
              <h2 className="text-lg font-semibold text-gray-900">{activeLesson.title}</h2>
            </div>

            {activeLesson.description && ["PDF", "VIDEO", "QUIZ"].includes(activeLesson.type) && (
              <div
                className="mb-4 prose prose-sm max-w-none text-gray-600 prose-a:text-[#1a73e8]"
                dangerouslySetInnerHTML={{ __html: activeLesson.description }}
              />
            )}
            {activeLesson.type === "TEXT" && <TextLesson content={activeLesson.content} />}
            {activeLesson.type === "PDF" && <PdfLesson url={activeLesson.content} />}
            {activeLesson.type === "VIDEO" && <VideoLesson url={activeLesson.content} />}
            {activeLesson.type === "QUIZ" && <QuizLesson content={activeLesson.content} onComplete={() => markComplete(activeLesson.id)} />}
            {activeLesson.type === "SCORM" && <ScormLesson url={activeLesson.content} onComplete={() => markComplete(activeLesson.id)} />}

            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
              <button onClick={() => setActiveIndex((i) => i - 1)} disabled={isFirst} className="btn-secondary disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" /> {t("previous")}
              </button>
              {activeLesson.type !== "QUIZ" && activeLesson.type !== "SCORM" && (
                <button
                  onClick={() => { markComplete(); if (!isLast) setActiveIndex((i) => i + 1); }}
                  className="btn-primary"
                >
                  {isLast ? <><CheckCircle className="h-4 w-4" /> {t("markComplete")}</> : <>{t("next")} <ChevronRight className="h-4 w-4" /></>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonNavButton({
  lesson, isActive, isDone, onClick,
}: {
  lesson: Lesson;
  isActive: boolean;
  isDone: boolean;
  onClick: () => void;
}) {
  const t = useTranslations("module");
  const Icon = LESSON_ICON[lesson.type];
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
        isActive ? "bg-[#1a73e8] text-white" : "text-gray-600 hover:bg-gray-50"
      )}
    >
      {isDone
        ? <CheckCircle className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-green-500")} />
        : <Icon className="h-4 w-4 flex-shrink-0" />
      }
      <div className="min-w-0">
        <p className="truncate font-medium">{lesson.title}</p>
        <p className={cn("text-xs", isActive ? "text-blue-100" : "text-gray-400")}>
          {t(LESSON_LABEL_KEY[lesson.type])}
        </p>
      </div>
    </button>
  );
}
