/**
 * Seeds the six Latvian (lv) curriculum modules and their lessons.
 *
 * Idempotent: matched by (language "lv", title). If a module already exists it
 * is left untouched — delete it by hand first if you want to re-import.
 *
 * PDF and SCORM assets are already uploaded to the production server; the URLs
 * below point at them. Run with:  npx tsx prisma/add-latvian-modules.ts
 */
import { PrismaClient, LessonType } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

type LessonSeed = {
  type: LessonType;
  title: string;
  description: string | null;
  content: string;
};

type ModuleSeed = {
  order: number;
  title: string;
  description: string;
  lessons: LessonSeed[];
};

const quiz = (m: string) =>
  JSON.stringify(
    JSON.parse(readFileSync(join(__dirname, "latvian-quizzes", `${m}.json`), "utf8"))
  );

const modules: ModuleSeed[] = [
  {
    order: 1,
    title: "1. Laika plānošana",
    description:
      "<p>Šis modulis piedāvā visaptverošu ceļvedi, lai lauku apvidu jaunie NEET jaunieši atgūtu kontroli pār savu ikdienu. Vidē, kur strukturēta nodarbinātība ir reta, laiks var kļūt vai nu par ienaidnieku (novedot pie izolācijas un apātijas), vai par stratēģisku sabiedroto. Mēs izpētām pāreju no pasīvas eksistences uz aktīvu pašpārvaldi, koncentrējoties uz lauku vides specifiskajām loģistikas un psiholoģiskajām barjerām.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Mācību materiāls – Laika plānošana",
        description:
          "<p>Pilnais 1. moduļa rokasgrāmata. Izejiet cauri četrām apakšvienībām: Lauku laika paradokss, SMART/PURE mērķu izvirzīšana, Eizenhauera matrica un prokrastinācijas pārvarēšana.</p>",
        content: "/api/uploads/pdfs/module-lv-1-time-management-1788510855591.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktīva prezentācija – Laika plānošana",
        description:
          "<p>Interaktīvs 1. moduļa galveno jēdzienu apskats. Pārvietojieties pa slaidiem savā tempā.</p>",
        content: "/api/uploads/scorm/module-lv-1-time-management-presentation-1788510868094/index.html",
      },
      {
        type: "QUIZ",
        title: "Pašnovērtējuma tests",
        description:
          "<p>Pārbaudiet savu izpratni par 1. moduli. Jautājumi ar atbilžu variantiem, patiesi/nepatiesi un savienošanas jautājumi — varat to atkārtot tik reižu, cik vēlaties.</p>",
        content: quiz("m1"),
      },
    ],
  },
  {
    order: 2,
    title: "2. Problēmu risināšana",
    description:
      "<p>Problēmas ir dzīves sastāvdaļa — nokavēts autobuss, nauda, kas beidzas pirms mēneša beigām, nezināšana, ko teikt darba intervijā. Labā ziņa ir tāda, ka tikšana ar tām galā ir prasme, ko var apgūt, praktizēt un pilnveidot. Šis modulis piedāvā praktisku, reālai dzīvei pietuvinātu pieeju lauku NEET jauniešiem, aptverot sešas vienības: kas patiesībā ir problēmu risināšana un kāpēc tā ir svarīga, lēmumu pieņemšana zem spiediena, praktisks analīzes paņēmienu komplekts, slēptie spēki, kas veido mūsu domāšanu, kā uzvedas jūsu smadzenes, risinot problēmas, un atkārtojams piecu soļu process, ko var pielietot gandrīz jebkurā situācijā.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Mācību materiāls – Problēmu risināšana",
        description:
          "<p>Pilnais 2. moduļa rokasgrāmata. Izejiet cauri sešām vienībām — kas ir problēmu risināšana un kāpēc tā ir svarīga, lēmumu pieņemšana, praktiski analīzes rīki, kognitīvās kļūdas, kas veido mūsu domāšanu, smadzenes un problēmu risināšana, un piecu soļu problēmu risināšanas process.</p>",
        content: "/api/uploads/pdfs/module-lv-2-problem-solving-1788510856882.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktīva prezentācija – Problēmu risināšana",
        description:
          "<p>Interaktīvs 2. moduļa galveno jēdzienu apskats. Pārvietojieties pa slaidiem savā tempā.</p>",
        content: "/api/uploads/scorm/module-lv-2-problem-solving-presentation-1788510876576/index.html",
      },
      {
        type: "QUIZ",
        title: "Pašnovērtējuma tests",
        description:
          "<p>Pārbaudiet savu izpratni — jautājumi ar atbilžu variantiem, patiesi/nepatiesi un savienošanas jautājumi.</p>",
        content: quiz("m2"),
      },
    ],
  },
  {
    order: 3,
    title: "3. Komandas darbs",
    description:
      "<p>Komandas darbs ir viena no tām prasmēm, ko visi uzskata par vieglu — saliekat cilvēkus kopā, dodat uzdevumu, un viņi tiks galā. Dažreiz tā notiek; bieži vien nē, un neviens nepaskaidro, kāpēc. Šis modulis seko stāstam: cilvēku grupai, kurai jāiemācās kļūt par komandu, lai pabeigtu projektu. Jūs apgūsiet, kas patiešām atšķir komandu no grupas, komunikāciju un to, kur tā salūst, sadarbības prasmes, Takmena piecus komandas attīstības posmus, domstarpību konstruktīvu risināšanu un ieradumus, kas padara komandas produktīvas. Uzsvars visā ir praktisks — rīki, ko varat izmantot darbā, kopienas projektā, apmācībā vai jebkur, kur strādājat kopā ar citiem cilvēkiem.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Mācību materiāls – Komandas darbs",
        description:
          "<p>Pilnais 3. moduļa rokasgrāmata. Sekojiet komandai cauri sešām apakšvienībām — komandas un grupas, komunikācija un tās izaicinājumi, sadarbības prasmes, pieci komandas attīstības posmi, domstarpību risināšana un komandas produktivitāte un panākumi.</p>",
        content: "/api/uploads/pdfs/module-lv-3-team-work-1788510858756.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktīva prezentācija – Komandas darbs",
        description:
          "<p>Interaktīvs 3. moduļa galveno jēdzienu apskats. Pārvietojieties pa slaidiem savā tempā.</p>",
        content: "/api/uploads/scorm/module-lv-3-team-work-presentation-1788510899317/index.html",
      },
      {
        type: "QUIZ",
        title: "Pašnovērtējuma tests",
        description:
          "<p>Pārbaudiet galvenos mācību punktus — jautājumi ar atbilžu variantiem, patiesi/nepatiesi un viens savienošanas jautājums.</p>",
        content: quiz("m3"),
      },
    ],
  },
  {
    order: 4,
    title: "4. Komunikācija",
    description:
      "<p>Komunikācija ir vairāk nekā informācijas nodošana — tā ir pamatprasme, lai atrastu darbu, lūgtu atbalstu, veidotu pašpārliecinātību un labi sadzīvotu ar citiem. Šis modulis to uztver kā apgūstamu uzvedību kopumu, ko var praktizēt un pilnveidot. Jūs apgūsiet komunikācijas procesu, atšķirību starp verbālo, neverbālo un paraverbālo komunikāciju, aktīvo klausīšanos, savu vajadzību un robežu cieņpilnu izteikšanu, asertivitāti, pārpratumu un barjeru atpazīšanu, ziņojuma pielāgošanu dažādām auditorijām un labu komunikāciju profesionālā un digitālā vidē — no ziņas darba devējam līdz darba intervijai vai grupas darbam.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Mācību materiāls – Komunikācija",
        description:
          "<p>Pilnais 4. moduļa rokasgrāmata — komunikācijas process, verbālā, neverbālā un paraverbālā komunikācija, aktīvā klausīšanās, asertivitāte un robežas, komunikācijas barjeras, pielāgošanās dažādām auditorijām un profesionālā un digitālā komunikācija.</p>",
        content: "/api/uploads/pdfs/module-lv-4-communication-1788510859504.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktīva prezentācija – Komunikācija",
        description:
          "<p>Interaktīvs 4. moduļa galveno jēdzienu apskats. Pārvietojieties pa slaidiem savā tempā.</p>",
        content: "/api/uploads/scorm/module-lv-4-communication-presentation-1788510904273/index.html",
      },
      {
        type: "QUIZ",
        title: "Pašnovērtējuma tests",
        description:
          "<p>Pārbaudiet savu izpratni — jautājumi ar atbilžu variantiem, patiesi/nepatiesi un viens savienošanas jautājums.</p>",
        content: quiz("m4"),
      },
    ],
  },
  {
    order: 5,
    title: "5. Pamata IT prasmes",
    description:
      "<p>Spēja lietot digitālos rīkus vairs nav izvēles jautājums — piekļuve informācijai, saziņa ar iestādēm, dokumentu sagatavošana, tiešsaistes pakalpojumu izmantošana un darba meklēšana — tas viss ir atkarīgs no digitālo prasmju pamatlīmeņa. Šis modulis ir praktisks, soli pa solim ievads tiem, kuri sāk ar zemu pašpārliecinātību. Jūs apgūsiet digitālās ierīces un datora pamatlietošanu, failu pārvaldību un organizēšanu, interneta lietošanu un meklēšanu, e-pastu un tiešsaistes komunikāciju, vienkāršu dokumentu izveidi, piekļuvi tiešsaistes pakalpojumiem un digitālo tehnoloģiju drošu un atbildīgu lietošanu.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Mācību materiāls – Pamata IT prasmes",
        description:
          "<p>Pilnais 5. moduļa rokasgrāmata — digitālās ierīces un datora pamatlietošana, failu pārvaldība, interneta lietošana un meklēšana, e-pasts un tiešsaistes komunikācija, dokumentu izveide, piekļuve tiešsaistes pakalpojumiem un digitālo tehnoloģiju droša, atbildīga lietošana.</p>",
        content: "/api/uploads/pdfs/module-lv-5-basic-it-skills-1788510860392.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktīva prezentācija – Pamata IT prasmes",
        description:
          "<p>Interaktīvs 5. moduļa galveno jēdzienu apskats. Pārvietojieties pa slaidiem savā tempā.</p>",
        content: "/api/uploads/scorm/module-lv-5-basic-it-skills-presentation-1788510906745/index.html",
      },
      {
        type: "QUIZ",
        title: "Pašnovērtējuma tests",
        description:
          "<p>Pārbaudiet savu izpratni — jautājumi ar atbilžu variantiem, patiesi/nepatiesi un viens savienošanas jautājums.</p>",
        content: quiz("m5"),
      },
    ],
  },
  {
    order: 6,
    title: "6. Pašapziņa",
    description:
      "<p>Pašapziņa ir savu domu, emociju, stipro pušu, vērtību un uzvedības modeļu apzināšanās — un tā redzēšana, kā tie veido jūsu izvēles attiecībā uz darbu, mācībām un dzīvi. Jauniešiem lauku apvidos, kuri saskaras ar nenoteiktību un ierobežotām iespējām, tā ir praktisks pamats pārliecinātiem lēmumiem. Šis modulis aptver sešas apakšvienības: pašapziņas izpratne, emocijas un pašregulācija, stiprās puses, vērtības un motivācija, pašapziņa darba tirgū, komunikācija un tas, kā mūs redz citi, un pašapziņas pārvēršana darbībā.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Mācību materiāls – Pašapziņa",
        description:
          "<p>Pilnais 6. moduļa rokasgrāmata — pašapziņas izpratne, emocijas un pašregulācija, stiprās puses, vērtības un motivācija, pašapziņa darba tirgū, komunikācija un ārējā pašapziņa, un pāreja no pašapziņas uz darbību.</p>",
        content: "/api/uploads/pdfs/module-lv-6-self-awareness-1788510861387.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktīva prezentācija – Pašapziņa",
        description:
          "<p>Interaktīvs 6. moduļa galveno jēdzienu apskats. Pārvietojieties pa slaidiem savā tempā.</p>",
        content: "/api/uploads/scorm/module-lv-6-self-awareness-presentation-1788510945799/index.html",
      },
      {
        type: "QUIZ",
        title: "Pašnovērtējuma tests",
        description:
          "<p>Pārbaudiet savu izpratni — jautājumi ar atbilžu variantiem, patiesi/nepatiesi un viens savienošanas jautājums.</p>",
        content: quiz("m6"),
      },
    ],
  },
];

async function main() {
  for (const m of modules) {
    const existing = await prisma.module.findFirst({
      where: { language: "lv", title: m.title },
    });
    if (existing) {
      console.log(`skip (exists): ${m.title} [${existing.id}]`);
      continue;
    }
    const created = await prisma.module.create({
      data: {
        title: m.title,
        description: m.description,
        category: "general",
        language: "lv",
        order: m.order,
        lessons: {
          create: m.lessons.map((l, i) => ({
            type: l.type,
            title: l.title,
            description: l.description,
            content: l.content,
            order: i + 1,
          })),
        },
      },
      include: { lessons: true },
    });
    console.log(`created: ${created.title} [${created.id}] with ${created.lessons.length} lessons`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
