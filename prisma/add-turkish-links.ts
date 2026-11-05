/**
 * Idempotent script to add the Turkish labour-market links (requested by the
 * Turkish partner). Each link is matched by URL and only inserted if missing.
 *
 *   npx tsx prisma/add-turkish-links.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const turkishLinks = [
  {
    country: "TR",
    agencyName: "İŞKUR (Turkish Employment Agency)",
    url: "https://www.iskur.gov.tr/",
    description:
      "The official Turkish public employment service, where jobseekers can register, search for vacancies, and access vocational training, counselling, and employment support programmes.",
    tags: "employment,training,guidance,public",
  },
  {
    country: "TR",
    agencyName: "Kariyer.net",
    url: "https://www.kariyer.net/",
    description:
      "Turkey's largest online recruitment platform, where users can build a CV, search for jobs across all sectors, and apply directly to employers.",
    tags: "jobs,search,vacancies,CV",
  },
  {
    country: "TR",
    agencyName: "Memurlar.net (Public Sector Jobs)",
    url: "https://ilan.memurlar.net/",
    description:
      "A portal with public sector job announcements, including civil service and government institution vacancies and recruitment news.",
    tags: "public sector,jobs,announcements",
  },
  {
    country: "TR",
    agencyName: "Ab-ilan.com (NGO Careers)",
    url: "https://ab-ilan.com/ngocareers/",
    description:
      "A job board dedicated to careers in non-governmental organisations, civil society, and EU-related projects and institutions.",
    tags: "NGO,jobs,EU,civil society",
  },
];

async function main() {
  for (const link of turkishLinks) {
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
