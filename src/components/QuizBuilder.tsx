"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, CheckCircle } from "lucide-react";

export type QuizQuestion = {
  id: string;
  type?: "multiple_choice" | "true_false" | "matching";
  text: string;
  // multiple_choice
  options?: string[];
  correctIndex?: number;
  // true_false
  correctAnswer?: boolean;
  // matching
  pairs?: { id: string; left: string; right: string }[];
};

export type QuizData = {
  questions: QuizQuestion[];
};

interface Props {
  value: string;
  onChange: (json: string) => void;
}

function emptyQuestion(type: QuizQuestion["type"] = "multiple_choice"): QuizQuestion {
  const id = crypto.randomUUID();
  if (type === "true_false") return { id, type, text: "", correctAnswer: true };
  if (type === "matching") return { id, type, text: "", pairs: [{ id: crypto.randomUUID(), left: "", right: "" }] };
  return { id, type: "multiple_choice", text: "", options: ["", "", "", ""], correctIndex: 0 };
}

export default function QuizBuilder({ value, onChange }: Props) {
  const t = useTranslations("admin.quiz");
  const parsed: QuizData = (() => {
    try { return JSON.parse(value); } catch { return { questions: [emptyQuestion()] }; }
  })();

  const [questions, setQuestions] = useState<QuizQuestion[]>(
    parsed.questions?.length ? parsed.questions : [emptyQuestion()]
  );

  const emit = (qs: QuizQuestion[]) => {
    setQuestions(qs);
    onChange(JSON.stringify({ questions: qs }));
  };

  const addQuestion = (type: QuizQuestion["type"]) => emit([...questions, emptyQuestion(type)]);
  const removeQuestion = (id: string) => emit(questions.filter((q) => q.id !== id));
  const updateQuestion = (id: string, patch: Partial<QuizQuestion>) =>
    emit(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => (
        <QuestionEditor
          key={q.id}
          question={q}
          index={qi}
          onUpdate={(patch) => updateQuestion(q.id, patch)}
          onRemove={() => removeQuestion(q.id)}
          canRemove={questions.length > 1}
        />
      ))}
      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={() => addQuestion("multiple_choice")} className="btn-secondary flex-1 text-xs py-2">
          <Plus className="h-3.5 w-3.5" /> {t("addMultipleChoice")}
        </button>
        <button type="button" onClick={() => addQuestion("true_false")} className="btn-secondary flex-1 text-xs py-2">
          <Plus className="h-3.5 w-3.5" /> {t("addTrueFalse")}
        </button>
        <button type="button" onClick={() => addQuestion("matching")} className="btn-secondary flex-1 text-xs py-2">
          <Plus className="h-3.5 w-3.5" /> {t("addMatching")}
        </button>
      </div>
    </div>
  );
}

function QuestionEditor({
  question: q, index, onUpdate, onRemove, canRemove,
}: {
  question: QuizQuestion;
  index: number;
  onUpdate: (patch: Partial<QuizQuestion>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const t = useTranslations("admin.quiz");
  const type = q.type ?? "multiple_choice";
  const typeLabel =
    type === "true_false" ? t("typeTrueFalse") : type === "matching" ? t("typeMatching") : t("typeMultipleChoice");

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">{t("question", { number: index + 1 })}</span>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            {typeLabel}
          </span>
        </div>
        {canRemove && (
          <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <textarea
        value={q.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder={t("questionPlaceholder")}
        rows={2}
        className="input w-full resize-none mb-3"
      />

      {type === "multiple_choice" && <MultipleChoiceEditor question={q} onUpdate={onUpdate} />}
      {type === "true_false" && <TrueFalseEditor question={q} onUpdate={onUpdate} />}
      {type === "matching" && <MatchingEditor question={q} onUpdate={onUpdate} />}
    </div>
  );
}

function MultipleChoiceEditor({
  question: q, onUpdate,
}: { question: QuizQuestion; onUpdate: (p: Partial<QuizQuestion>) => void }) {
  const t = useTranslations("admin.quiz");
  const options = q.options ?? ["", "", "", ""];
  return (
    <div className="space-y-2">
      {options.map((opt, oi) => (
        <div key={oi} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onUpdate({ correctIndex: oi })}
            className={q.correctIndex === oi ? "text-green-500" : "text-gray-300 hover:text-gray-400"}
            title={t("markCorrect")}
          >
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          </button>
          <input
            value={opt}
            onChange={(e) => {
              const next = options.map((o, i) => (i === oi ? e.target.value : o));
              onUpdate({ options: next });
            }}
            placeholder={t("optionPlaceholder", { letter: String.fromCharCode(65 + oi) })}
            className="input flex-1"
          />
        </div>
      ))}
      <p className="mt-1 text-xs text-gray-400">{t("clickCircleHint")}</p>
    </div>
  );
}

function TrueFalseEditor({
  question: q, onUpdate,
}: { question: QuizQuestion; onUpdate: (p: Partial<QuizQuestion>) => void }) {
  const t = useTranslations("admin.quiz");
  return (
    <div className="flex gap-3">
      {([true, false] as const).map((val) => {
        const selected = q.correctAnswer === val;
        return (
          <button
            key={String(val)}
            type="button"
            onClick={() => onUpdate({ correctAnswer: val })}
            className={`flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-colors ${
              selected
                ? "border-green-400 bg-green-50 text-green-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {val ? t("true") : t("false")} {selected && "✓"}
          </button>
        );
      })}
    </div>
  );
}

function MatchingEditor({
  question: q, onUpdate,
}: { question: QuizQuestion; onUpdate: (p: Partial<QuizQuestion>) => void }) {
  const t = useTranslations("admin.quiz");
  const pairs = q.pairs ?? [];

  const updatePair = (id: string, field: "left" | "right", val: string) =>
    onUpdate({ pairs: pairs.map((p) => (p.id === id ? { ...p, [field]: val } : p)) });

  const addPair = () =>
    onUpdate({ pairs: [...pairs, { id: crypto.randomUUID(), left: "", right: "" }] });

  const removePair = (id: string) =>
    onUpdate({ pairs: pairs.filter((p) => p.id !== id) });

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 px-1 text-xs font-medium text-gray-500">
        <span>{t("leftItem")}</span>
        <span>{t("rightItemMatch")}</span>
      </div>
      {pairs.map((pair) => (
        <div key={pair.id} className="flex items-center gap-2">
          <input
            value={pair.left}
            onChange={(e) => updatePair(pair.id, "left", e.target.value)}
            placeholder={t("leftItemPlaceholder")}
            className="input flex-1"
          />
          <span className="text-gray-300 flex-shrink-0">→</span>
          <input
            value={pair.right}
            onChange={(e) => updatePair(pair.id, "right", e.target.value)}
            placeholder={t("rightItemPlaceholder")}
            className="input flex-1"
          />
          {pairs.length > 1 && (
            <button type="button" onClick={() => removePair(pair.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addPair} className="btn-secondary w-full py-1.5 text-xs">
        <Plus className="h-3.5 w-3.5" /> {t("addPair")}
      </button>
      <p className="text-xs text-gray-400">{t("matchHint")}</p>
    </div>
  );
}
