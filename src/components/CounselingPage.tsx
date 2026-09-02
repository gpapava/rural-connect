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
  Award,
  Loader2,
} from "lucide-react";
import Link from "next/link";
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

type CertData = { id: string; issuedAt: Date } | null;

interface CounselingPageProps {
  stages: StageData[];
  neetUser: UserInfo | null;
  counselor: UserInfo | null;
  currentUser: UserInfo;
  locale: string;
  certificate: CertData;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVE_SESSION_STATUSES = new Set(["PENDING", "SCHEDULED", "IN_PROGRESS"]);

const SESSION_STATUS_KEY: Record<string, string> = {
  PENDING: "session.pending",
  SCHEDULED: "session.scheduled",
  IN_PROGRESS: "session.inProgress",
  COMPLETED: "session.completed",
  CANCELLED: "session.cancelled",
};

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
  const t = useTranslations("counseling");
  const [open, setOpen] = useState(false);
  const statusLabel = t.has(SESSION_STATUS_KEY[session.status] ?? "")
    ? t(SESSION_STATUS_KEY[session.status])
    : session.status;

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
            <p className="text-xs text-gray-500">
              {t("stage.historyLine", { status: statusLabel, count: session.messages.length })}
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
            <p className="text-xs text-gray-400 text-center py-2">{t("noMessagesInSession")}</p>
          )}

          {/* Files */}
          {session.sharedFiles.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t("files.title")}
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
                    {t("notesLabel")}
                  </p>
                  <p className="text-xs text-gray-700 whitespace-pre-wrap">{session.notes}</p>
                </div>
              )}
              {session.actionPlan && (
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                    {t("actionPlanLabel")}
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
  const tRoles = useTranslations("common.roles");
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
                {t("close")}
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
                      {t("waitingAccept")}
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
              <p className="text-xs text-gray-500">
                {tRoles.has(otherUser.role) ? tRoles(otherUser.role) : otherUser.role}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">{t("online")}</span>
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
              <p className="text-xs text-gray-400 italic">{t("typing", { name: typingUser })}</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 p-3">
            <div className="flex items-end gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                title={t("attachFile")}
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
              {uploadingFile ? t("uploading") : t("files.upload")}
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
    if (!confirm(t("stage.confirmComplete"))) return;
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
        <p className="text-base font-semibold text-gray-500">{t("stage.notReached")}</p>
        <p className="mt-1 text-sm text-gray-400">
          {t("stage.unlockHint")}
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
          <h3 className="text-sm font-semibold text-gray-900">{t("stage.summary")}</h3>
          {summarySaved && (
            <span className="text-xs font-medium text-green-600">{t("stage.saved")}</span>
          )}
        </div>
        {isCounselor ? (
          <>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={t("stage.summaryPlaceholder")}
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            />
            <button
              onClick={saveSummary}
              disabled={savingSummary}
              className="btn-secondary mt-3 w-full"
            >
              <Save className="h-4 w-4" />
              {t("stage.saveSummary")}
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {summary || (
              <span className="text-gray-400 italic">{t("stage.noSummary")}</span>
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
              {t("currentSession")} —{" "}
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
            {activeSession ? t("stage.previousSessions") : t("stage.sessions")}
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
          <p className="text-sm text-gray-400">{t("stage.noSessions")}</p>
        </div>
      )}

      {/* Complete stage button — counselor only, active stages only */}
      {isCounselor && stage.status === "ACTIVE" && stage.number < 5 && (
        <div className="rounded-xl border border-[#34a853]/20 bg-green-50 p-4">
          <p className="mb-3 text-sm text-gray-700">
            {t("stage.completeHint")}
          </p>
          <button
            onClick={completeStage}
            disabled={completing}
            className="flex items-center gap-2 rounded-lg bg-[#34a853] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d9147] disabled:opacity-50"
          >
            <Flag className="h-4 w-4" />
            {completing ? t("stage.completing") : t("stage.completeAndUnlock", { number: stage.number })}
          </button>
        </div>
      )}

      {/* Final stage complete */}
      {isCounselor && stage.status === "ACTIVE" && stage.number === 5 && (
        <div className="rounded-xl border border-[#34a853]/20 bg-green-50 p-4">
          <p className="mb-3 text-sm text-gray-700">
            {t("stage.finalHint")}
          </p>
          <button
            onClick={completeStage}
            disabled={completing}
            className="flex items-center gap-2 rounded-lg bg-[#34a853] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d9147] disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            {completing ? t("stage.completing") : t("stage.completeJourney")}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Journey Progress Bar ─────────────────────────────────────────────────────

function JourneyProgress({
  stages,
  isCounselor,
  neetUser,
  certificate,
  onCertIssued,
  locale,
}: {
  stages: StageData[];
  isCounselor: boolean;
  neetUser: UserInfo | null;
  certificate: CertData;
  onCertIssued: (cert: CertData) => void;
  locale: string;
}) {
  const t = useTranslations("counseling");
  const tStages = useTranslations("stages");
  const completedCount = stages.filter((s) => s.status === "COMPLETED").length;
  const pct = (completedCount / 5) * 100;
  const allDone = completedCount === 5;

  const [animPct, setAnimPct] = useState(0);
  const [issuing, setIssuing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);

  useEffect(() => {
    // Animate bar fill on mount
    const t = setTimeout(() => setAnimPct(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);

  const handleIssue = async () => {
    if (!neetUser || !confirmed) return;
    setIssuing(true);
    setIssueError(null);
    try {
      const res = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ neetUserId: neetUser.id }),
      });
      if (res.ok) {
        const cert = await res.json();
        onCertIssued(cert);
      } else {
        const data = await res.json();
        setIssueError(data.error ?? t("journey.issueFailed"));
      }
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className={cn(
      "mb-5 rounded-2xl border p-5",
      allDone && certificate
        ? "border-[#34a853]/30 bg-gradient-to-r from-green-50 to-emerald-50"
        : allDone
        ? "border-amber-200 bg-amber-50"
        : "border-gray-200 bg-white"
    )}>
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className={cn("h-5 w-5", allDone && certificate ? "text-[#34a853]" : allDone ? "text-amber-500" : "text-gray-400")} />
          <span className="text-sm font-semibold text-gray-800">{t("journey.title")}</span>
        </div>
        <span className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold",
          allDone && certificate ? "bg-[#34a853]/10 text-[#34a853]" : allDone ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
        )}>
          {t("journey.stagesComplete", { completed: completedCount })}
        </span>
      </div>

      {/* Stage dots + bar */}
      <div className="relative mb-3">
        {/* Bar track */}
        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out",
              allDone && certificate
                ? "bg-gradient-to-r from-[#34a853] to-emerald-400"
                : allDone
                ? "bg-gradient-to-r from-amber-400 to-yellow-300"
                : "bg-gradient-to-r from-[#1a73e8] to-blue-400"
            )}
            style={{ width: `${animPct}%` }}
          />
        </div>
        {/* Stage tick marks */}
        <div className="absolute inset-x-0 top-0 flex h-3 items-center justify-between px-0">
          {stages.map((s, i) => {
            const isComp = s.status === "COMPLETED";
            const isAct = s.status === "ACTIVE";
            const pos = ((i + 1) / 5) * 100;
            return (
              <div
                key={s.id}
                className="absolute -translate-x-1/2 -translate-y-[3px]"
                style={{ left: `${pos}%` }}
              >
                <div className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center text-white",
                  isComp ? "border-[#34a853] bg-[#34a853]" : isAct ? "border-[#1a73e8] bg-[#1a73e8]" : "border-gray-300 bg-white"
                )}>
                  {isComp && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {isAct && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage labels */}
      <div className="flex justify-between px-0">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="flex flex-col items-center" style={{ width: "20%" }}>
            <span className="text-center text-[10px] leading-tight text-gray-400 max-w-[70px]">{tStages(`names.${n}`)}</span>
          </div>
        ))}
      </div>

      {/* Certificate incentive banner — always visible until cert is earned */}
      {!certificate && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
            <Award className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-yellow-800">
              {t("journey.earnBanner")}
            </p>
            <p className="mt-0.5 text-xs text-yellow-700 leading-relaxed">
              {t("journey.earnBannerBody")}
            </p>
          </div>
          <div className="hidden flex-shrink-0 flex-col items-center sm:flex">
            <span className="text-2xl font-bold text-yellow-400">{completedCount}</span>
            <span className="text-[10px] font-medium text-yellow-500">{t("journey.ofFive")}</span>
          </div>
        </div>
      )}

      {/* Certificate actions */}
      {allDone && (
        <div className="mt-5 border-t border-gray-200/60 pt-4">
          {certificate ? (
            /* CERTIFICATE IS ISSUED — both roles see download */
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#34a853]">
                  {t("journey.certReady")}
                </p>
                <p className="text-xs text-gray-500">
                  {t("journey.issuedOn", {
                    date: new Date(certificate.issuedAt).toLocaleDateString(locale, {
                      day: "numeric", month: "long", year: "numeric",
                    }),
                  })}
                </p>
              </div>
              <Link
                href={`/${locale}/certificate/${certificate.id}`}
                target="_blank"
                className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-[#34a853] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2d9147] transition-colors"
              >
                <Award className="h-4 w-4" />
                {t("journey.viewDownload")}
              </Link>
            </div>
          ) : isCounselor && neetUser ? (
            /* COUNSELLOR — approval panel */
            <div className="space-y-3">
              <p className="text-sm font-semibold text-amber-700">
                {t("journey.counsellorCanIssue")}
              </p>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-amber-200 bg-white p-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#34a853]"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                <span className="text-sm text-gray-700">
                  {t.rich("journey.confirmIssue", {
                    name: neetUser.name,
                    b: (chunks) => <strong>{chunks}</strong>,
                  })}
                </span>
              </label>
              {issueError && (
                <p className="text-xs text-red-600">{issueError}</p>
              )}
              <button
                onClick={handleIssue}
                disabled={!confirmed || issuing}
                className="flex items-center gap-2 rounded-xl bg-[#34a853] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2d9147] disabled:opacity-50 transition-colors"
              >
                {issuing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
                {issuing ? t("journey.issuing") : t("journey.issueCert")}
              </button>
            </div>
          ) : (
            /* NEET — waiting on counsellor */
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
              <p className="text-sm text-amber-700">
                {t("journey.neetWaiting")}
              </p>
            </div>
          )}
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
  certificate: initialCertificate,
}: CounselingPageProps) {
  const t = useTranslations("counseling");
  const tStages = useTranslations("stages");
  const [stages, setStages] = useState(initialStages);
  const [certificate, setCertificate] = useState<CertData>(initialCertificate);
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
          <h2 className="mb-2 text-lg font-semibold text-gray-900">{t("noPairTitle")}</h2>
          <p className="text-sm text-gray-500">
            {t("noPairBody")}
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
              {isCounselor ? t("counsellingUser", { name: otherUser.name }) : t("withUser", { name: otherUser.name })}
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
            {t("journeyPill", { completed: stages.filter((s) => s.status === "COMPLETED").length })}
          </span>
        </div>
      </div>

      {/* Journey progress bar */}
      <JourneyProgress
        stages={stages}
        isCounselor={isCounselor}
        neetUser={neetUser}
        certificate={certificate}
        onCertIssued={setCertificate}
        locale={locale}
      />

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
                  <span className="font-medium">{tStages("stageLabel", { number: stage.number })}</span>
                  <span
                    className={cn(
                      "ml-1.5 hidden xl:inline text-xs",
                      isSelected ? "text-gray-500" : "text-gray-400"
                    )}
                  >
                    {tStages(`names.${stage.number}`)}
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
              {tStages(`names.${selectedStage.number}`)}
            </h2>
            <p className="text-xs text-gray-400">
              {t("stage.statusLine", {
                status: t.has(`stageStatus.${selectedStage.status.toLowerCase()}`)
                  ? t(`stageStatus.${selectedStage.status.toLowerCase()}`)
                  : selectedStage.status,
                count: selectedStage.sessions.length,
              })}
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
