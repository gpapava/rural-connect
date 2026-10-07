import { readSheet } from "read-excel-file/node";

export const IMPORT_LANGUAGES = ["en", "el", "tr", "lv", "es", "it", "no"] as const;
export const IMPORT_COUNTRIES = ["NO", "GR", "TR", "LV", "ES", "IT"] as const;
export const MAX_IMPORT_ROWS = 500;

export type ImportRow = {
  line: number; // 1-based spreadsheet line (header = 1)
  name: string;
  email: string;
  country: string | null;
  language: string | null;
};

export type ImportIssue = { line: number; email?: string; reason: string };

const COUNTRY_ALIASES: Record<string, string> = {
  no: "NO", norway: "NO", norge: "NO", norvēģija: "NO", norvegija: "NO", "νορβηγία": "NO",
  gr: "GR", greece: "GR", grieķija: "GR", "ελλάδα": "GR", "ελλαδα": "GR", yunanistan: "GR", grecia: "GR", hellas: "GR",
  tr: "TR", turkey: "TR", türkiye: "TR", turkiye: "TR", turcija: "TR", "τουρκία": "TR", turquía: "TR", turchia: "TR", tyrkia: "TR",
  lv: "LV", latvia: "LV", latvija: "LV", letonia: "LV", lettonia: "LV", "λετονία": "LV", letonya: "LV", latvia_no: "LV",
  es: "ES", spain: "ES", spānija: "ES", españa: "ES", spagna: "ES", "ισπανία": "ES", ispanya: "ES", spania: "ES",
  it: "IT", italy: "IT", itālija: "IT", italia: "IT", "ιταλία": "IT", italya: "IT",
};

const LANGUAGE_ALIASES: Record<string, string> = {
  en: "en", english: "en", angļu: "en", inglés: "en", inglese: "en", "αγγλικά": "en", ingilizce: "en", engelsk: "en",
  el: "el", greek: "el", "ελληνικά": "el", grieķu: "el", griego: "el", greco: "el", yunanca: "el", gresk: "el",
  tr: "tr", turkish: "tr", türkçe: "tr", turkce: "tr", turku: "tr", turco: "tr", "τουρκικά": "tr", tyrkisk: "tr",
  lv: "lv", latvian: "lv", latviešu: "lv", latviesu: "lv", letón: "lv", lettone: "lv", "λετονικά": "lv", letonca: "lv", latvisk: "lv",
  es: "es", spanish: "es", español: "es", spāņu: "es", spagnolo: "es", "ισπανικά": "es", ispanyolca: "es", spansk: "es",
  it: "it", italian: "it", italiano: "it", itāļu: "it", "ιταλικά": "it", italyanca: "it", italiensk: "it",
  no: "no", norwegian: "no", norsk: "no", norvēģu: "no", noruego: "no", norvegese: "no", "νορβηγικά": "no", norveççe: "no",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Minimal CSV parser: quotes, escaped quotes, comma / semicolon / tab delimiters. */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const firstLine = src.split(/\r?\n/, 1)[0] ?? "";
  const counts = { ",": 0, ";": 0, "\t": 0 } as Record<string, number>;
  let q = false;
  for (const ch of firstLine) {
    if (ch === '"') q = !q;
    else if (!q && ch in counts) counts[ch]++;
  }
  const delim = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  q = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (q) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cell += '"'; i++; } else q = false;
      } else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === delim) { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      rows.push(row); row = [];
    } else cell += ch;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

export async function readRows(fileName: string, data: Buffer): Promise<string[][]> {
  const lower = fileName.toLowerCase();
  let raw: unknown[][];
  if (lower.endsWith(".csv") || lower.endsWith(".txt")) {
    raw = parseCsv(data.toString("utf8"));
  } else if (lower.endsWith(".xlsx")) {
    raw = (await readSheet(data)) as unknown[][];
  } else {
    throw new Error("Unsupported file type. Upload an .xlsx or .csv file.");
  }
  return raw
    .map((r) => r.map((c) => (c === null || c === undefined ? "" : String(c).trim())))
    .filter((r) => r.some((c) => c !== ""));
}

type ColumnMap = { name: number; first: number; last: number; email: number; country: number; language: number };

function detectColumns(header: string[]): ColumnMap {
  const map: ColumnMap = { name: -1, first: -1, last: -1, email: -1, country: -1, language: -1 };
  header.forEach((raw, i) => {
    const h = raw.toLowerCase();
    if (map.email < 0 && /e-?mail|epasts|e-pasts|ηλεκτρονικ/.test(h)) map.email = i;
    else if (map.first < 0 && /first\s*name|given\s*name|^vārds$|^όνομα$|^isim$|^ad$|fornavn/.test(h)) map.first = i;
    else if (map.last < 0 && /last\s*name|surname|family\s*name|uzvārds|επώνυμο|soyad|etternavn/.test(h)) map.last = i;
    else if (map.name < 0 && /name|vārds|όνομα|nombre|nome|isim|navn/.test(h)) map.name = i;
    else if (map.country < 0 && /country|valsts|χώρα|país|paese|ülke|land/.test(h)) map.country = i;
    else if (map.language < 0 && /language|valoda|γλώσσα|idioma|lingua|dil|språk/.test(h)) map.language = i;
  });
  return map;
}

export function mapRows(rows: string[][]): { items: ImportRow[]; issues: ImportIssue[] } {
  const issues: ImportIssue[] = [];
  const items: ImportRow[] = [];
  if (rows.length === 0) return { items, issues: [{ line: 1, reason: "The file is empty." }] };

  let map = detectColumns(rows[0]);
  let start = 1;
  const hasHeader = map.email >= 0;
  if (!hasHeader) {
    // No recognisable header: assume column 1 = name, column 2 = email (optional 3 = country, 4 = language)
    map = { name: 0, first: -1, last: -1, email: 1, country: 2, language: 3 };
    start = 0;
  }
  if (map.name < 0 && map.first < 0) {
    return { items, issues: [{ line: 1, reason: 'Could not find a "name" column.' }] };
  }

  const seen = new Set<string>();
  for (let i = start; i < rows.length; i++) {
    const r = rows[i];
    const line = i + 1;
    const cell = (idx: number) => (idx >= 0 ? (r[idx] ?? "").trim() : "");
    const email = cell(map.email).toLowerCase();
    const name =
      map.first >= 0 || map.last >= 0
        ? `${cell(map.first)} ${cell(map.last)}`.trim() || cell(map.name)
        : cell(map.name);

    if (!email && !name) continue;
    if (!email || !EMAIL_RE.test(email)) { issues.push({ line, email: email || undefined, reason: "Invalid or missing email." }); continue; }
    if (!name) { issues.push({ line, email, reason: "Missing name." }); continue; }
    if (seen.has(email)) { issues.push({ line, email, reason: "Duplicate email in the file." }); continue; }
    seen.add(email);

    const rawCountry = cell(map.country);
    const rawLanguage = cell(map.language);
    const country = rawCountry
      ? COUNTRY_ALIASES[rawCountry.toLowerCase()] ?? (rawCountry.length === 2 ? rawCountry.toUpperCase() : null)
      : null;
    const language = rawLanguage ? LANGUAGE_ALIASES[rawLanguage.toLowerCase()] ?? null : null;
    items.push({ line, name, email, country, language });
  }
  return { items, issues };
}
