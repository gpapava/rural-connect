"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Reports each page the browser shows (including client-side navigation). Sets no cookies. */
export default function PageViewTracker() {
  const pathname = usePathname();
  const sent = useRef<string | null>(null);

  useEffect(() => {
    if (sent.current === pathname) return;
    sent.current = pathname;
    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
