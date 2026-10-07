/**
 * One-off, idempotent script to add the Latvian job-portal links supplied by
 * the Latvian partner ("Links for work portals.docx", Oct 2026) to an
 * already-seeded database (e.g. production). Matched by URL, only inserted if
 * missing.
 *
 *   npx tsx prisma/add-latvian-links.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const aggregator =
  "Job offer portal – a compiler that displays vacancies from many other sources of Latvian job advertisements in one place.";

const latvianLinks = [
  {
    country: "LV",
    agencyName: "State Employment Agency (NVA) – Vacancies Portal",
    url: "https://cvvp.nva.gov.lv/#/pub/",
    description:
      "The official national portal with registered vacancies and allowances.",
    tags: "employment,vacancies,allowances",
  },
  {
    country: "LV",
    agencyName: "CV-Online",
    url: "https://www.cv.lv/lv",
    description:
      "The largest job ad and career opportunity portal in Latvia.",
    tags: "jobs,career,vacancies",
  },
  {
    country: "LV",
    agencyName: "Visas iespējas",
    url: "https://visasiespejas.lv/",
    description: "Specialised youth opportunities portal.",
    tags: "youth,opportunities,jobs",
  },
  {
    country: "LV",
    agencyName: "VISI DARBI",
    url: "https://www.visidarbi.lv/",
    description: aggregator,
    tags: "jobs,search,vacancies",
  },
  {
    country: "LV",
    agencyName: "Ir darbs",
    url: "https://www.irdarbs.lv/",
    description: aggregator,
    tags: "jobs,search,vacancies",
  },
  {
    country: "LV",
    agencyName: "Tei r darbs",
    url: "https://teirdarbs.lv/",
    description: aggregator,
    tags: "jobs,search,vacancies",
  },
];

async function main() {
  for (const link of latvianLinks) {
    const existing = await prisma.laborMarketLink.findFirst({
      where: { url: link.url },
    });
    if (existing) {
      console.log(`skip  ${link.agencyName} (already present)`);
      continue;
    }
    await prisma.laborMarketLink.create({ data: link });
    console.log(`added ${link.agencyName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
