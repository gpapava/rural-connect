/**
 * One-off, idempotent script to add the Italian labour-market links to an
 * already-seeded database (e.g. production). Safe to run multiple times:
 * each link is matched by URL and only inserted if missing.
 *
 *   npx tsx prisma/add-italian-links.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const italianLinks = [
  {
    country: "IT",
    agencyName: "ClicLavoro",
    url: "https://www.cliclavoro.gov.it",
    description:
      "The official Italian Ministry of Labour job portal, offering job vacancies, career guidance, training opportunities, internships, and employment services.",
    tags: "employment,training,guidance,internships",
  },
  {
    country: "IT",
    agencyName: "Servizi Lavoro",
    url: "https://servizi.lavoro.gov.it",
    description:
      "Italy's public employment services platform, where users can search for jobs, manage their employment profile, and access career support services.",
    tags: "employment,career,services",
  },
  {
    country: "IT",
    agencyName: "LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs",
    description:
      "A professional networking platform where users can search for jobs, connect with employers, and build their professional profile.",
    tags: "jobs,networking,employers",
  },
  {
    country: "IT",
    agencyName: "Indeed Italy",
    url: "https://it.indeed.com",
    description:
      "One of the world's largest job search engines, featuring thousands of vacancies from companies, recruitment agencies, and public organizations.",
    tags: "jobs,search,vacancies",
  },
  {
    country: "IT",
    agencyName: "Adecco Italy",
    url: "https://www.adecco.it",
    description:
      "A global recruitment agency offering permanent, temporary, and internship opportunities, along with career guidance services.",
    tags: "recruitment,internships,guidance",
  },
];

async function main() {
  for (const link of italianLinks) {
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
