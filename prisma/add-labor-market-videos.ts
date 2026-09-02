/**
 * Idempotent script to add job-search tutorial videos to the "Tips & Videos"
 * tab of the Labor Market page. Safe to run repeatedly — each video is matched
 * by its YouTube URL and only inserted if missing.
 *
 *   npx tsx prisma/add-labor-market-videos.ts
 *
 * Fill in the `videos` array below with the real YouTube links. Fields:
 *   language    - locale code the video is in: "en" | "el" | "es" | "it" | "tr" | "lv" | "no"
 *   title       - shown as the card heading
 *   description - short blurb under the title (optional, keep it to ~2 lines)
 *   youtubeUrl  - full watch URL, e.g. https://www.youtube.com/watch?v=XXXXXXXXXXX
 *   order       - lower numbers show first within a language (optional, default 0)
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const videos: {
  language: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  order?: number;
}[] = [
  // --- Example (delete and replace with the real ones) ---
  // {
  //   language: "en",
  //   title: "How to write a CV that gets noticed",
  //   description: "A short walkthrough of CV structure, wording and common mistakes.",
  //   youtubeUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  //   order: 1,
  // },
  // {
  //   language: "el",
  //   title: "Πώς να γράψεις ένα καλό βιογραφικό",
  //   description: "Δομή, διατύπωση και συνηθισμένα λάθη στο βιογραφικό σημείωμα.",
  //   youtubeUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  //   order: 1,
  // },
];

async function main() {
  if (videos.length === 0) {
    console.log("No videos defined — edit the `videos` array in this file first.");
    return;
  }
  for (const v of videos) {
    const existing = await prisma.laborMarketVideo.findFirst({
      where: { youtubeUrl: v.youtubeUrl },
    });
    if (existing) {
      console.log(`skip  [${v.language}] ${v.title} (already present)`);
      continue;
    }
    await prisma.laborMarketVideo.create({
      data: {
        language: v.language,
        title: v.title,
        description: v.description ?? null,
        youtubeUrl: v.youtubeUrl,
        order: v.order ?? 0,
      },
    });
    console.log(`added [${v.language}] ${v.title}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
