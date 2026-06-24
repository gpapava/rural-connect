"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Send,
  Video,
  VideoOff,
  Paperclip,
  FileText,
  Download,
  Save,
  Clock,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Flag,
} from "lucide-react";
import { cn, formatDate, formatDateTime, getInitials } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { createPusherClient } from "@/lib/pusher";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageWithSender = {
  id: string;
  content: string;
  createdAt: Date | string;
  sender: { id: string; name: string; role: UserRole };
};

type SharedFile = {
  id: string;
  fileName: string;
  fileUrl: string;
  createdAt: Date;
  uploadedBy: { id: string; name: string };
};

type SessionData = {
  id: string;
  status: string;
  scheduledAt: Date;
  notes: string | null;
  actionPlan: string | null;
  messages: MessageWithSender[];
  sharedFiles: SharedFile[];
};

type StageData = {
  id: string;
  number: number;
  summary: string | null;
  status: "LOCKED" | "ACTIVE" | "COMPLETED";
  sessions: SessionData[];
};

type UserInfo = { id: string; name: string; email: string; role: UserRole };

interface CounselingPageProps {
  stages: StageData[];
  neetUser: UserInfo | null;
  counselor: UserInfo | null;
  currentUser: UserInfo;
  locale: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGE_NAMES = [
  "Learning the Platform",
  "Previous Experience",
  "Why You Need an Opportunity",
  "Confidence & Orientation",
  "Career Opportunities",
];

const ACTIVE_SESSION_STATUSES = new Set(["PENDING", "SCHEDULED", "IN_PROGRESS"]);

// ─── Sub-components ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  currentUserId,
}: {
  msg: MessageWithSender;
  currentUserId: string;
}) {
  const isSelf = msg.sender.id === currentUserId;
  return (
    <div className={cn("flex gap-2", isSelf ? "flex-row-reverse" : "flex-row")}>
      {!isSelf && (
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
          {getInitials(msg.sender.name)}
        </div>
      )}
      <div className="max-w-[80%]">
        {!isSelf && (
          <p className="mb-0.5 text-xs font-medium text-gray-500">{msg.sender.name}</p>
        )}
        <div className={isSelf ? "chat-bubble-self" : "chat-bubble-other"}>{msg.content}</div>
        <p className={cn("mt-0.5 text-xs text-gray-400", isSelf ? "text-right" : "text-left")}>
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

function FileRow({ file }: { file: SharedFile }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2">
      <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-gray-700">{file.fileName}</p>
        <p className="text-xs text-gray-400">
          {file.uploadedBy.name} · {formatDate(file.createdAt)}
        </p>
      </div>
      <a
        href={file.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 text-gray-400 hover:text-[#1a73e8]"
      >
        <Download className="h-4 w-4" />
      </a>
    </div>
  );
}

// Read-only session history card shown for past sessions within a stage
function SessionHistoryCard({
  session,
  currentUserId,
}: {
  session: SessionData;
  currentUserId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {formatDateTime(session.scheduledAt)}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {session.status.toLowerCase().replace("_", " ")} ·{" "}
              {session.messages.length} messages
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-4">
          {/* Messages */}
          {session.messages.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {session.messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} currentUserId={currentUserId} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-2">No messages in this session</p>
          )}

          {/* Files */}
          {session.sharedFiles.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Shared Files
              </p>
              <div className="space-y-1">
                {session.sharedFiles.map((file) => (
                  <FileRow key={file.id} file={file} />
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {(session.notes || session.actionPlan) && (
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 space-y-2">
              {session.notes && (
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                    Notes
                  </p>
                  <p className="text-xs text-gray-700 whitespace-pre-wrap">{session.notes}</p>
                </div>
              )}
              {session.actionPlan && (
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                    Action Plan
                  </p>
                  <p className="text-xs text-gray-700 whitespace-pre-wrap">{session.actionPlan}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// The live active session panel (chat + video + notes + files)
function LiveSessionPanel({
  session,
  currentUser,
  otherUser,
  t,
}: {
  session: SessionData;
  currentUser: UserInfo;
  otherUser: UserInfo;
  t: ReturnType<typeof useTranslations>;
}) {
  const [messages, setMessages] = useState<MessageWithSender[]>(session.messages);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [notes, setNotes] = useState(session.notes ?? "");
  const [actionPlan, setActionPlan] = useState(session.actionPlan ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>(session.sharedFiles);
  const [uploadingFile, setUploadingFile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const pusher = createPusherClient();
    const channel = pusher.subscribe(`session-${session.id}`);

    channel.bind("new-message", (message: MessageWithSender) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    channel.bind("user-typing", (data: { userId: string; name: string }) => {
      if (data.userId !== currentUser.id) setTypingUser(data.name);
    });

    channel.bind("user-stopped-typing", (data: { userId: string }) => {
      if (data.userId !== currentUser.id) setTypingUser(null);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`session-${session.id}`);
      pusher.disconnect();
    };
  }, [session.id, currentUser.id]);

  const sendTypingEvent = useCallback(
    async (isTyping: boolean) => {
      await fetch("/api/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, isTyping }),
      });
    },
    [session.id]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTypingEvent(true);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendTypingEvent(false);
    }, 2000);
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;
    setSending(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendTypingEvent(false);
    }
    const optimisticMsg: MessageWithSender = {
      id: `temp-${Date.now()}`,
      content: messageInput.trim(),
      createdAt: new Date(),
      sender: { id: currentUser.id, name: currentUser.name, role: currentUser.role },
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setMessageInput("");
    try {
      const res = await fetch("/api/socket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, content: optimisticMsg.content }),
      });
      if (res.ok) {
        const { message } = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === optimisticMsg.id ? message : m)));
      }
    } catch {
      // keep optimistic message
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await fetch(`/api/sessions/${session.id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, actionPlan }),
      });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } finally {
      setSavingNotes(false);
    }
  };

  const uploadFile = async (file: File) => {
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/sessions/${session.id}/files`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { file: uploaded } = await res.json();
        setSharedFiles((prev) => [...prev, uploaded]);
      }
    } finally {
      setUploadingFile(false);
    }
  };

  const isPending = session.status === "PENDING";

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
          e.target.value = "";
        }}
      />

      {/* Video — left 2/3 */}
      <div className="lg:col-span-2">
        <div className="card h-full flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{t("video.title")}</h3>
            {videoOpen && (
              <button
                onClick={() => setVideoOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Close
              </button>
            )}
          </div>
          {videoOpen ? (
            <div className="flex-1 overflow-hidden rounded-xl bg-gray-900" style={{ minHeight: 480 }}>
              <iframe
                src={`https://meet.jit.si/ruralconnect-${session.id}`}
                allow="camera; microphone; fullscreen; display-capture"
                className="h-full w-full border-0"
                style={{ minHeight: 480 }}
              />
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <div
                className="flex flex-1 items-center justify-center rounded-xl bg-gray-900"
                style={{ minHeight: 380 }}
              >
                <div className="text-center text-white">
                  <VideoOff className="mx-auto mb-3 h-12 w-12 opacity-40" />
                  <p className="text-sm opacity-50">{t("video.notStarted")}</p>
                  {isPending && (
                    <p className="mt-2 text-xs text-yellow-300 opacity-80">
                      Waiting for session to be accepted
                    </p>
                  )}
                </div>
              </div>
              {!isPending && (
                <button onClick={() => setVideoOpen(true)} className="btn-primary mt-3 w-full">
                  <Video className="h-4 w-4" />
                  {t("video.join")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        {/* Chat */}
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1a73e8]/10 text-xs font-bold text-[#1a73e8]">
              {getInitials(otherUser.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{otherUser.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {otherUser.role.toLowerCase().replace("_", " ")}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[220px] max-h-[320px]">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-xs text-gray-400">{t("chat.noMessages")}</p>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} currentUserId={currentUser.id} />
              ))
            )}
            {typingUser && (
              <p className="text-xs text-gray-400 italic">{typingUser} is typing…</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 p-3">
            <div className="flex items-end gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                title="Attach file"
                className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <textarea
                value={messageInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t("chat.placeholder")}
                rows={2}
                className="flex-1 resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
              />
              <button
                onClick={sendMessage}
                disabled={!messageInput.trim() || sending}
                className="flex-shrink-0 rounded-lg bg-[#1a73e8] p-1.5 text-white hover:bg-[#1558b0] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Session notes */}
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{t("notes.title")}</h3>
            {notesSaved && (
              <span className="text-xs font-medium text-green-600">{t("notes.saved")}</span>
            )}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("notes.placeholder")}
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
          />
          <label className="mt-2 block text-xs font-medium text-gray-700">
            {t("notes.actionPlan")}
          </label>
          <textarea
            value={actionPlan}
            onChange={(e) => setActionPlan(e.target.value)}
            placeholder={t("notes.actionPlanPlaceholder")}
            rows={2}
            className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
          />
          <button
            onClick={saveNotes}
            disabled={savingNotes}
            className="btn-secondary mt-3 w-full"
          >
            <Save className="h-4 w-4" />
            {t("notes.save")}
          </button>
        </div>

        {/* Shared files */}
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{t("files.title")}</h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
              className="btn-secondary py-1 px-2 text-xs disabled:opacity-50"
            >
              <Paperclip className="h-3 w-3" />
              {uploadingFile ? "Uploading…" : t("files.upload")}
            </button>
          </div>
          {sharedFiles.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-4">{t("files.noFiles")}</p>
          ) : (
            <div className="space-y-2">
              {sharedFiles.map((file) => (
                <FileRow key={file.id} file={file} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stage Content ─────────────────────────────────────────────────────────────

function StageContent({
  stage,
  currentUser,
  otherUser,
  isCounselor,
  t,
  onComplete,
}: {
  stage: StageData;
  currentUser: UserInfo;
  otherUser: UserInfo;
  isCounselor: boolean;
  t: ReturnType<typeof useTranslations>;
  onComplete: (stageId: string) => Promise<void>;
}) {
  const [summary, setSummary] = useState(stage.summary ?? "");
  const [savingSummary, setSavingSummary] = useState(false);
  const [summarySaved, setSummarySaved] = useState(false);
  const [completing, setCompleting] = useState(false);

  const saveSummary = async () => {
    setSavingSummary(true);
    try {
      await fetch(`/api/stages/${stage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });
      setSummarySaved(true);
      setTimeout(() => setSummarySaved(false), 2000);
    } finally {
      setSavingSummary(false);
    }
  };

  const completeStage = async () => {
    if (!confirm("Mark this stage as complete and unlock the next one?")) return;
    setCompleting(true);
    try {
      await onComplete(stage.id);
    } finally {
      setCompleting(false);
    }
  };

  if (stage.status === "LOCKED") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Lock className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-base font-semibold text-gray-500">Stage not yet reached</p>
        <p className="mt-1 text-sm text-gray-400">
          Complete the previous stage to unlock this one.
        </p>
      </div>
    );
  }

  const activeSession = stage.sessions.find((s) => ACTIVE_SESSION_STATUSES.has(s.status));
  const pastSessions = stage.sessions.filter((s) => !ACTIVE_SESSION_STATUSES.has(s.status));
  // Also include "active" sessions that are from a previous time as history if there's no truly active one
  const historyToShow = activeSession
    ? pastSessions
    : stage.sessions.filter((s) => !ACTIVE_SESSION_STATUSES.has(s.status));

  return (
    <div className="space-y-6">
      {/* Stage summary */}
      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Stage Summary</h3>
          {summarySaved && (
            <span className="text-xs font-medium text-green-600">Saved</span>
          )}
        </div>
        {isCounselor ? (
          <>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a summary for this stage — key observations, progress made, outcomes..."
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            />
            <button
              onClick={saveSummary}
              disabled={savingSummary}
              className="btn-secondary mt-3 w-full"
            >
              <Save className="h-4 w-4" />
              Save Summary
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {summary || (
              <span className="text-gray-400 italic">No summary written yet for this stage.</span>
            )}
          </p>
        )}
      </div>

      {/* Live active session */}
      {activeSession && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <h3 className="text-sm font-semibold text-gray-900">
              Current Session —{" "}
              <span className="font-normal text-gray-500">
                {formatDateTime(activeSession.scheduledAt)}
              </span>
            </h3>
          </div>
          <LiveSessionPanel
            session={activeSession}
            currentUser={currentUser}
            otherUser={otherUser}
            t={t}
          />
        </div>
      )}

      {/* Session history within this stage */}
      {historyToShow.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            {activeSession ? "Previous Sessions in This Stage" : "Sessions"}
          </h3>
          <div className="space-y-2">
            {historyToShow.map((s) => (
              <SessionHistoryCard key={s.id} session={s} currentUserId={currentUser.id} />
            ))}
          </div>
        </div>
      )}

      {/* No sessions yet */}
      {stage.sessions.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
          <Clock className="mx-auto mb-2 h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-400">No sessions scheduled for this stage yet.</p>
        </div>
      )}

      {/* Complete stage button — counselor only, active stages only */}
      {isCounselor && stage.status === "ACTIVE" && stage.number < 5 && (
        <div className="rounded-xl border border-[#34a853]/20 bg-green-50 p-4">
          <p className="mb-3 text-sm text-gray-700">
            When you&apos;re satisfied with the progress in this stage, mark it complete to
            unlock the next stage.
          </p>
          <button
            onClick={completeStage}
            disabled={completing}
            className="flex items-center gap-2 rounded-lg bg-[#34a853] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d9147] disabled:opacity-50"
          >
            <Flag className="h-4 w-4" />
            {completing ? "Completing…" : `Complete Stage ${stage.number} & Unlock Next`}
          </button>
        </div>
      )}

      {/* Final stage complete */}
      {isCounselor && stage.status === "ACTIVE" && stage.number === 5 && (
        <div className="rounded-xl border border-[#34a853]/20 bg-green-50 p-4">
          <p className="mb-3 text-sm text-gray-700">
            This is the final stage. Mark it complete when the full counselling journey is done.
          </p>
          <button
            onClick={completeStage}
            disabled={completing}
            className="flex items-center gap-2 rounded-lg bg-[#34a853] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d9147] disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            {completing ? "Completing…" : "Complete Counselling Journey"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function CounselingPage({
  stages: initialStages,
  neetUser,
  counselor,
  currentUser,
  locale,
}: CounselingPageProps) {
  const t = useTranslations("counseling");
  const [stages, setStages] = useState(initialStages);
  const [selectedStageIdx, setSelectedStageIdx] = useState(() => {
    // Default to the current active stage
    const activeIdx = initialStages.findIndex((s) => s.status === "ACTIVE");
    return activeIdx >= 0 ? activeIdx : 0;
  });

  const isCounselor = currentUser.role === "COUNSELOR";
  const otherUser = isCounselor ? neetUser : counselor;

  const handleCompleteStage = async (stageId: string) => {
    const res = await fetch(`/api/stages/${stageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    });
    if (res.ok) {
      // Update local state: mark current stage completed, unlock next
      setStages((prev) =>
        prev.map((s) => {
          if (s.id === stageId) return { ...s, status: "COMPLETED" as const };
          const completedStage = prev.find((x) => x.id === stageId);
          if (completedStage && s.number === completedStage.number + 1 && s.status === "LOCKED") {
            return { ...s, status: "ACTIVE" as const };
          }
          return s;
        })
      );
      // Move to the next stage
      setSelectedStageIdx((i) => Math.min(i + 1, 4));
    }
  };

  // No pair established yet
  if (stages.length === 0 || (!neetUser && !counselor)) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Video className="h-8 w-8 text-[#1a73e8]" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">No Active Session</h2>
          <p className="text-sm text-gray-500">
            You don&apos;t have any active or upcoming counseling sessions. Contact your counselor
            to schedule one.
          </p>
        </div>
      </div>
    );
  }

  const selectedStage = stages[selectedStageIdx];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          {otherUser && (
            <p className="text-sm text-gray-500">
              {isCounselor ? "Counselling" : "With"} {otherUser.name}
            </p>
          )}
        </div>
        {/* Journey progress pill */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500">
          {stages.map((s) => (
            <span
              key={s.id}
              className={cn(
                "h-2 w-2 rounded-full",
                s.status === "COMPLETED"
                  ? "bg-[#34a853]"
                  : s.status === "ACTIVE"
                  ? "bg-[#1a73e8]"
                  : "bg-gray-200"
              )}
            />
          ))}
          <span className="ml-1">
            {stages.filter((s) => s.status === "COMPLETED").length} / 5 stages complete
          </span>
        </div>
      </div>

      {/* Chrome-style stage tabs */}
      <div className="relative mb-0">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {stages.map((stage, idx) => {
            const isSelected = idx === selectedStageIdx;
            const isCompleted = stage.status === "COMPLETED";
            const isActive = stage.status === "ACTIVE";
            const isLocked = stage.status === "LOCKED";

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageIdx(idx)}
                className={cn(
                  "group relative flex flex-shrink-0 items-center gap-2 border-l border-r border-t px-4 py-2.5 text-sm transition-colors",
                  isSelected
                    ? "z-10 -mb-px rounded-t-lg border-gray-200 bg-white font-semibold text-gray-900"
                    : isLocked
                    ? "border-transparent bg-transparent text-gray-300 cursor-not-allowed"
                    : "border-transparent bg-gray-50 text-gray-500 hover:bg-white hover:text-gray-700"
                )}
                disabled={isLocked}
              >
                {/* Stage status icon */}
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#34a853]" />
                ) : isActive ? (
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#1a73e8]" />
                ) : (
                  <Lock className="h-3.5 w-3.5 flex-shrink-0 text-gray-300" />
                )}

                {/* Tab label */}
                <span className="whitespace-nowrap">
                  <span className="font-medium">Stage {stage.number}</span>
                  <span
                    className={cn(
                      "ml-1.5 hidden xl:inline text-xs",
                      isSelected ? "text-gray-500" : "text-gray-400"
                    )}
                  >
                    {STAGE_NAMES[stage.number - 1]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage content */}
      <div className="mt-6">
        {/* Stage heading */}
        <div className="mb-5 flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white",
              selectedStage.status === "COMPLETED"
                ? "bg-[#34a853]"
                : selectedStage.status === "ACTIVE"
                ? "bg-[#1a73e8]"
                : "bg-gray-300"
            )}
          >
            {selectedStage.status === "COMPLETED" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              selectedStage.number
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {STAGE_NAMES[selectedStage.number - 1]}
            </h2>
            <p className="text-xs text-gray-400 capitalize">
              {selectedStage.status.toLowerCase()} ·{" "}
              {selectedStage.sessions.length} session
              {selectedStage.sessions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {otherUser && (
          <StageContent
            stage={selectedStage}
            currentUser={currentUser}
            otherUser={otherUser}
            isCounselor={isCounselor}
            t={t}
            onComplete={handleCompleteStage}
          />
        )}
      </div>
    </div>
  );
}
