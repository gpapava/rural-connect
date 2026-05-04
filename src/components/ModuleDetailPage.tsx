"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Lesson = {
  id: string;
  title: string;
  type: "TEXT" | "PDF" | "QUIZ";
  content: string;
  order: number;
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
  question: string;
  options: string[];
  correct: number;
};

interface ModuleDetailPageProps {
  module: Module;
  lessons: Lesson[];
  status: string;
  locale: string;
}

function TextLesson({ content }: { content: string }) {
  const lines = content.split("\n");

  const rendered = lines.map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i} className="text-base font-semibold text-gray-800 mt-4 mb-2">{line.slice(4)}</h3>;
    if (line.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-[#1a73e8] pl-4 py-1 bg-blue-50 rounded-r-lg text-sm text-blue-800 my-3">{line.slice(2)}</blockquote>;
    if (line.startsWith("- ")) return <li key={i} className="ml-4 text-sm text-gray-700 list-disc">{line.slice(2)}</li>;
    if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-gray-800 text-sm mt-2">{line.slice(2, -2)}</p>;

    // Inline bold
    if (line.includes("**")) {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-sm text-gray-700 leading-relaxed my-1">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j}>{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    }

    if (line.trim() === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-sm text-gray-700 leading-relaxed my-1">{line}</p>;
  });

  return <div className="prose max-w-none">{rendered}</div>;
}

function PdfLesson({ url }: { url: string }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <iframe
          src={`${url}#toolbar=1&navpanes=0`}
          className="w-full"
          style={{ height: "520px" }}
          title="PDF Document"
        />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-[#1a73e8] hover:underline"
      >
        <ExternalLink className="h-4 w-4" />
        Open in new tab
      </a>
    </div>
  );
}

function QuizLesson({ content, onComplete }: { content: string; onComplete: () => void }) {
  const { questions }: { questions: QuizQuestion[] } = JSON.parse(content);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? questions.filter((q) => answers[q.id] === q.correct).length
    : 0;

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) return;
    setSubmitted(true);
    if (score === questions.length) onComplete();
  };

  return (
    <div className="space-y-6">
      {submitted && (
        <div className={cn(
          "rounded-xl p-4 text-center",
          score === questions.length ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
        )}>
          <p className={cn("text-lg font-bold", score === questions.length ? "text-green-700" : "text-yellow-700")}>
            {score === questions.length ? "Perfect score!" : `${score} / ${questions.length} correct`}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {score === questions.length
              ? "You've completed this module!"
              : "Review the highlighted answers and try again."}
          </p>
          {score < questions.length && (
            <button
              onClick={() => { setAnswers({}); setSubmitted(false); }}
              className="mt-3 text-sm font-medium text-[#1a73e8] hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {questions.map((q, qi) => (
        <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-semibold text-gray-900 mb-4">
            {qi + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === oi;
              const isCorrect = oi === q.correct;
              let style = "border-gray-200 bg-gray-50 text-gray-700 hover:border-[#1a73e8]/40";
              if (submitted) {
                if (isCorrect) style = "border-green-400 bg-green-50 text-green-800";
                else if (selected && !isCorrect) style = "border-red-400 bg-red-50 text-red-700";
                else style = "border-gray-200 bg-gray-50 text-gray-400";
              } else if (selected) {
                style = "border-[#1a73e8] bg-blue-50 text-[#1a73e8]";
              }

              return (
                <button
                  key={oi}
                  disabled={submitted}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                  className={cn(
                    "w-full text-left rounded-lg border px-4 py-2.5 text-sm transition-all",
                    style
                  )}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="btn-primary w-full disabled:opacity-50"
        >
          Submit answers
        </button>
      )}
    </div>
  );
}

const lessonIcon = {
  TEXT: BookOpen,
  PDF: FileText,
  QUIZ: HelpCircle,
};

const lessonLabel = {
  TEXT: "Reading",
  PDF: "PDF",
  QUIZ: "Quiz",
};

export default function ModuleDetailPage({ module, lessons, status, locale }: ModuleDetailPageProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const activeLesson = lessons[activeIndex];
  const isLast = activeIndex === lessons.length - 1;
  const isFirst = activeIndex === 0;

  const markComplete = () => {
    setCompletedLessons((prev) => { const next = new Set(prev); next.add(activeLesson.id); return next; });
  };

  if (lessons.length === 0) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <p className="text-gray-500">No lessons available for this module yet.</p>
        <button onClick={() => router.back()} className="btn-secondary mt-4">
          <ArrowLeft className="h-4 w-4" /> Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <button
          onClick={() => router.push(`/${locale}/library`)}
          className="mt-1 flex-shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#1a73e8] mb-1">{module.category}</p>
          <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{module.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Lessons</p>
            <div className="space-y-1">
              {lessons.map((lesson, i) => {
                const Icon = lessonIcon[lesson.type];
                const done = completedLessons.has(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
                      activeIndex === i
                        ? "bg-[#1a73e8] text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {done ? (
                      <CheckCircle className={cn("h-4 w-4 flex-shrink-0", activeIndex === i ? "text-white" : "text-green-500")} />
                    ) : (
                      <Icon className="h-4 w-4 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{lesson.title}</p>
                      <p className={cn("text-xs", activeIndex === i ? "text-blue-100" : "text-gray-400")}>
                        {lessonLabel[lesson.type]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">{lessonLabel[activeLesson.type]}</p>
                <h2 className="text-lg font-semibold text-gray-900">{activeLesson.title}</h2>
              </div>
            </div>

            {activeLesson.type === "TEXT" && (
              <TextLesson content={activeLesson.content} />
            )}
            {activeLesson.type === "PDF" && (
              <PdfLesson url={activeLesson.content} />
            )}
            {activeLesson.type === "QUIZ" && (
              <QuizLesson content={activeLesson.content} onComplete={markComplete} />
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
              <button
                onClick={() => setActiveIndex((i) => i - 1)}
                disabled={isFirst}
                className="btn-secondary disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              {activeLesson.type !== "QUIZ" && (
                <button
                  onClick={() => {
                    markComplete();
                    if (!isLast) setActiveIndex((i) => i + 1);
                  }}
                  className="btn-primary"
                >
                  {isLast ? (
                    <><CheckCircle className="h-4 w-4" /> Mark complete</>
                  ) : (
                    <>Next <ChevronRight className="h-4 w-4" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
