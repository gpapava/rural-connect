"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle } from "lucide-react";

export type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
};

export type QuizData = {
  questions: QuizQuestion[];
};

interface Props {
  value: string;
  onChange: (json: string) => void;
}

function emptyQuestion(): QuizQuestion {
  return { id: crypto.randomUUID(), text: "", options: ["", "", "", ""], correctIndex: 0 };
}

export default function QuizBuilder({ value, onChange }: Props) {
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

  const addQuestion = () => emit([...questions, emptyQuestion()]);

  const removeQuestion = (id: string) => emit(questions.filter((q) => q.id !== id));

  const updateQuestion = (id: string, patch: Partial<QuizQuestion>) =>
    emit(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const updateOption = (qId: string, idx: number, val: string) =>
    emit(questions.map((q) =>
      q.id === qId ? { ...q, options: q.options.map((o, i) => (i === idx ? val : o)) } : q
    ));

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => (
        <div key={q.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Question {qi + 1}</span>
            {questions.length > 1 && (
              <button type="button" onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <textarea
            value={q.text}
            onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
            placeholder="Question text *"
            rows={2}
            className="input w-full resize-none mb-3"
          />
          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuestion(q.id, { correctIndex: oi })}
                  className={q.correctIndex === oi ? "text-green-500" : "text-gray-300 hover:text-gray-400"}
                  title="Mark as correct answer"
                >
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                </button>
                <input
                  value={opt}
                  onChange={(e) => updateOption(q.id, oi, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                  className="input flex-1"
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400">Click the circle next to the correct answer</p>
        </div>
      ))}
      <button type="button" onClick={addQuestion} className="btn-secondary w-full">
        <Plus className="h-4 w-4" /> Add Question
      </button>
    </div>
  );
}
