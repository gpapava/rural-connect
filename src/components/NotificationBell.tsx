"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bell, Check, X, Calendar } from "lucide-react";
import { createPusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  data: string | null;
  read: boolean;
  createdAt: string;
};

interface NotificationBellProps {
  userId: string;
  locale: string;
}

export default function NotificationBell({ userId, locale }: NotificationBellProps) {
  const t = useTranslations("notifications");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const [responding, setResponding] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const pusher = createPusherClient();
    const channel = pusher.subscribe(`notifications-${userId}`);

    channel.bind("new-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`notifications-${userId}`);
      pusher.disconnect();
    };
  }, [userId]);

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleOpen = () => {
    setOpen((v) => !v);
    // Mark all as read when opening
    notifications.filter((n) => !n.read).forEach((n) => markRead(n.id));
  };

  const respond = async (notification: Notification, accept: boolean) => {
    const data = notification.data ? JSON.parse(notification.data) : {};
    if (!data.sessionId) return;

    setResponding(notification.id);
    try {
      await fetch(`/api/sessions/${data.sessionId}/respond`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });

      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));

      if (accept) {
        setOpen(false);
        router.push(`/${locale}/counseling`);
        router.refresh();
      }
    } finally {
      setResponding(null);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleOpen}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#fbbc04] text-[10px] font-bold text-gray-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-xl border border-gray-100 bg-white shadow-xl">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">{t("title")}</p>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="mx-auto mb-2 h-6 w-6 text-gray-300" />
              <p className="text-sm text-gray-400">{t("empty")}</p>
            </div>
          ) : (
            <div className="max-h-96 divide-y divide-gray-50 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "px-4 py-3",
                    !n.read && "bg-blue-50/40"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1a73e8]/10">
                      <Calendar className="h-3.5 w-3.5 text-[#1a73e8]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{n.body}</p>

                      {n.type === "SESSION_INVITE" && (
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => respond(n, true)}
                            disabled={responding === n.id}
                            className="flex items-center gap-1 rounded-lg bg-[#1a73e8] px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-[#1558b0] disabled:opacity-50"
                          >
                            <Check className="h-3 w-3" />
                            {t("accept")}
                          </button>
                          <button
                            onClick={() => respond(n, false)}
                            disabled={responding === n.id}
                            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                          >
                            <X className="h-3 w-3" />
                            {t("decline")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
