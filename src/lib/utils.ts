import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { localeTags, type Locale } from "@/i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Resolve a next-intl locale code (e.g. "el", "no") to a BCP-47 tag for Intl formatting.
// Falls back to en-GB when no locale is passed or it is unknown.
function dateLocaleTag(locale?: string): string {
  return (locale && localeTags[locale as Locale]) || "en-GB";
}

export function formatDate(date: Date | string | null, locale?: string): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(dateLocaleTag(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string | null, locale?: string): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(dateLocaleTag(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
