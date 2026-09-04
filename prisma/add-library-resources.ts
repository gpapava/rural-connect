/**
 * Seeds the per-language "Further Reading" resources shown on the e-Library
 * page (LibraryResource model). Curated bibliographies + a few institutional
 * links, supplied by the partners per country.
 *
 * Idempotent: matched by (language, title). Re-run to add newly listed
 * resources; existing rows are left untouched.
 *
 * Document PDFs are already uploaded to production; JSON files under
 * prisma/library-resources/<lang>.json hold title / description / url / kind.
 * Run with:  npx tsx prisma/add-library-resources.ts
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

type ResourceSeed = {
  order: number;
  kind: "document" | "link";
  title: string;
  description: string | null;
  url: string;
};

const dir = join(__dirname, "library-resources");

async function main() {
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const language = file.replace(/\.json$/, "");
    const items: ResourceSeed[] = JSON.parse(
      readFileSync(join(dir, file), "utf8")
    );
    for (const r of items) {
      const existing = await prisma.libraryResource.findFirst({
        where: { language, title: r.title },
      });
      if (existing) {
        console.log(`skip (exists): [${language}] ${r.title.slice(0, 60)}`);
        continue;
      }
      await prisma.libraryResource.create({
        data: {
          language,
          title: r.title,
          description: r.description,
          url: r.url,
          kind: r.kind,
          order: r.order,
        },
      });
      console.log(`created: [${language}] (${r.kind}) ${r.title.slice(0, 60)}`);
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
