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
} from "lucide-react";
import { cn, formatDate, formatDateTime, getInitials } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { createPusherClient } from "@/lib/pusher";

type MessageWithSender = {
  id: string;
  content: string;
  createdAt: Date | string;
  sender: { id: string; name: string; role: UserRole };
};

type SessionData = {
  id: string;
  status: string;
  scheduledAt: Date;
  notes: string | null;
  actionPlan: string | null;
  neetUser: { id: string; name: string; email: string; role: UserRole };
  counselor: { id: string; name: string; email: string; role: UserRole };
  messages: MessageWithSender[];
  sharedFiles: {
    id: string;
    fileName: string;
    fileUrl: string;
    createdAt: Date;
    uploadedBy: { id: string; name: string };
  }[];
} | null;

interface CounselingPageProps {
  session: SessionData;
  currentUser: { id: string; name: string; email: string; role: UserRole };
  locale: string;
}

export default function CounselingPage({
  session,
  currentUser,
  locale,
}: CounselingPageProps) {
  const t = useTranslations("counseling");
  const [messages, setMessages] = useState<MessageWithSender[]>(
    session?.messages ?? []
  );
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [notes, setNotes] = useState(session?.notes ?? "");
  const [actionPlan, setActionPlan] = useState(session?.actionPlan ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!session) return;

    const pusher = createPusherClient();
    const channel = pusher.subscribe(`session-${session.id}`);

    channel.bind("new-message", (message: MessageWithSender) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    channel.bind("user-typing", (data: { userId: string; name: string }) => {
      if (data.userId !== currentUser.id) {
        setTypingUser(data.name);
      }
    });

    channel.bind("user-stopped-typing", (data: { userId: string }) => {
      if (data.userId !== currentUser.id) {
        setTypingUser(null);
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`session-${session.id}`);
      pusher.disconnect();
    };
  }, [session?.id, currentUser.id]);

  const sendTypingEvent = useCallback(
    async (isTyping: boolean) => {
      if (!session) return;
      await fetch("/api/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, isTyping }),
      });
    },
    [session]
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
    if (!messageInput.trim() || !session) return;
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
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? message : m))
        );
      }
    } catch {
      // keep optimistic update
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
    if (!session) return;
    setSavingNotes(true);
    try {
      await fetch(`/api/sessions/${session.id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, actionPlan }),
      });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch {
      // handle error
    } finally {
      setSavingNotes(false);
    }
  };

  if (!session) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Video className="h-8 w-8 text-[#1a73e8]" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            No Active Session
          </h2>
          <p className="text-sm text-gray-500">
            You don&apos;t have any active or upcoming counseling sessions. Contact
            your counselor to schedule one.
          </p>
        </div>
      </div>
    );
  }

  const otherUser =
    currentUser.id === session.neetUser.id
      ? session.counselor
      : session.neetUser;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500">
            {t(`session.${session.status.toLowerCase()}` as any)} &middot;{" "}
            {formatDateTime(session.scheduledAt)}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            session.status === "IN_PROGRESS"
              ? "bg-green-100 text-green-800"
              : session.status === "SCHEDULED"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-600"
          )}
        >
          {t(`session.${session.status.toLowerCase()}` as any)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Chat panel */}
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a73e8]/10 text-sm font-bold text-[#1a73e8]">
              {getInitials(otherUser.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {otherUser.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {otherUser.role.toLowerCase().replace("_", " ")}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-400">{t("chat.noMessages")}</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isSelf = msg.sender.id === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2",
                      isSelf ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {!isSelf && (
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                        {getInitials(msg.sender.name)}
                      </div>
                    )}
                    <div className="max-w-[70%]">
                      {!isSelf && (
                        <p className="mb-1 text-xs font-medium text-gray-500">
                          {msg.sender.name}
                        </p>
                      )}
                      <div
                        className={
                          isSelf ? "chat-bubble-self" : "chat-bubble-other"
                        }
                      >
                        {msg.content}
                      </div>
                      <p
                        className={cn(
                          "mt-1 text-xs text-gray-400",
                          isSelf ? "text-right" : "text-left"
                        )}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            {typingUser && (
              <p className="text-xs text-gray-400 italic">{typingUser} is typing…</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-end gap-2">
              <button className="flex-shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
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
                className="flex-shrink-0 rounded-lg bg-[#1a73e8] p-2 text-white transition-colors hover:bg-[#1558b0] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Video placeholder */}
          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                {t("video.title")}
              </h3>
            </div>
            <div className="flex h-36 items-center justify-center rounded-xl bg-gray-900">
              <div className="text-center text-white">
                <VideoOff className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-xs opacity-50">{t("video.notStarted")}</p>
              </div>
            </div>
            <button className="btn-primary mt-3 w-full">
              <Video className="h-4 w-4" />
              {t("video.join")}
            </button>
          </div>

          {/* Session notes */}
          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                {t("notes.title")}
              </h3>
              {notesSaved && (
                <span className="text-xs font-medium text-green-600">
                  {t("notes.saved")}
                </span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("notes.placeholder")}
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            />
            <label className="mt-3 block text-xs font-medium text-gray-700">
              {t("notes.actionPlan")}
            </label>
            <textarea
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              placeholder={t("notes.actionPlanPlaceholder")}
              rows={3}
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
              <h3 className="text-sm font-semibold text-gray-900">
                {t("files.title")}
              </h3>
              <button className="btn-secondary py-1 px-2 text-xs">
                <Paperclip className="h-3 w-3" />
                {t("files.upload")}
              </button>
            </div>
            {session.sharedFiles.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-4">
                {t("files.noFiles")}
              </p>
            ) : (
              <div className="space-y-2">
                {session.sharedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-gray-700">
                        {file.fileName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(file.createdAt)}
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
