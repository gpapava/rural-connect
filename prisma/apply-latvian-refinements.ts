/**
 * One-off: applies the Latvian partner's wording refinements (Oct 2026) to the
 * production DB, and replaces the lv "Further Reading" set with the
 * Latvian-only list in prisma/library-resources/lv.json (English docs removed,
 * descriptions translated). Idempotent.
 * Run with:  npx tsx prisma/apply-latvian-refinements.ts
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

const fix = (s: string) =>
  s
    .replace(/<p>Pilnais (\d)\. moduļa/g, "<p>$1. moduļa")
    .replace("lauku apvidu jaunie NEET jaunieši", "lauku apvidu NEET jaunieši")
    .replace(/apakšvienībām/g, "nodaļām")
    .replace(
      "Pārbaudiet savu izpratni par 1. moduli. Jautājumi ar atbilžu variantiem, patiesi/nepatiesi un savienošanas jautājumi — varat to atkārtot tik reižu, cik vēlaties.",
      "Pārbaudiet savu izpratni par 1. moduli. Iekļauti jautājumi ar dažādiem atbilžu variantiem, patiesi/nepatiesi izvēlēm un savienošanas jautājumi. Testu varat atkārtot tik reižu, cik vēlaties."
    );

async function main() {
  const mods = await prisma.module.findMany({
    where: { language: "lv" },
    include: { lessons: true },
  });
  for (const m of mods) {
    const d = fix(m.description ?? "");
    if (d !== m.description) {
      await prisma.module.update({ where: { id: m.id }, data: { description: d } });
      console.log(`updated module: ${m.title}`);
    }
    for (const l of m.lessons) {
      const ld = l.description ? fix(l.description) : l.description;
      if (ld !== l.description) {
        await prisma.moduleLesson.update({ where: { id: l.id }, data: { description: ld } });
        console.log(`updated lesson: ${m.title} / ${l.title}`);
      }
    }
  }

  const items = JSON.parse(
    readFileSync(join(__dirname, "library-resources", "lv.json"), "utf8")
  ) as { order: number; title: string; description: string }[];
  const del = await prisma.libraryResource.deleteMany({
    where: { language: "lv", title: { notIn: items.map((i) => i.title) } },
  });
  console.log(`deleted ${del.count} non-Latvian lv resources`);
  for (const r of items) {
    await prisma.libraryResource.updateMany({
      where: { language: "lv", title: r.title },
      data: { description: r.description, order: r.order },
    });
  }
}
main().then(() => prisma.$disconnect());
