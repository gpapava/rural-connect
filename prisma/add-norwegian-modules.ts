/**
 * Seeds the six Norwegian (no) curriculum modules and their lessons.
 *
 * Idempotent: matched by (language "no", title). If a module already exists it
 * is left untouched — delete it by hand first if you want to re-import.
 *
 * PDF and SCORM assets are already uploaded to the production server; the URLs
 * below point at them. Run with:  npx tsx prisma/add-norwegian-modules.ts
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
    JSON.parse(readFileSync(join(__dirname, "norwegian-quizzes", `${m}.json`), "utf8"))
  );

const modules: ModuleSeed[] = [
  {
    order: 1,
    title: "1. Tidsstyring",
    description:
      "<p>Denne modulen gir et helhetlig veikart slik at unge NEET-er i distriktene kan ta tilbake kontrollen over hverdagen sin. I miljøer der strukturert arbeid er en mangelvare, kan tid enten bli en fiende (som fører til isolasjon og apati) eller en strategisk alliert. Vi utforsker overgangen fra passiv tilværelse til aktiv selvledelse, med fokus på de spesifikke logistiske og psykologiske barrierene i distriktene.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Lærestoff – Tidsstyring",
        description:
          "<p>Hele håndboken for Modul 1. Jobb deg gjennom de fire delenhetene om det rurale tidsparadokset, SMART/PURE-målsetting, Eisenhower-matrisen og å beseire prokrastinering.</p>",
        content: "/api/uploads/pdfs/module-no-1-time-management-1788511669327.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktiv presentasjon – Tidsstyring",
        description:
          "<p>En interaktiv gjennomgang av nøkkelbegrepene i Modul 1. Beveg deg gjennom lysbildene i ditt eget tempo.</p>",
        content: "/api/uploads/scorm/module-no-1-time-management-presentation-1788511685826/index.html",
      },
      {
        type: "QUIZ",
        title: "Egenvurderingstest",
        description:
          "<p>Sjekk din forståelse av Modul 1. Flervalg, riktig/feil og koblingsoppgaver — du kan ta den på nytt så mange ganger du vil.</p>",
        content: quiz("m1"),
      },
    ],
  },
  {
    order: 2,
    title: "2. Problemløsning",
    description:
      "<p>Problemer er en del av livet — å gå glipp av bussen, å gå tom for penger før måneden er omme, å ikke vite hva man skal si på et jobbintervju. Den gode nyheten er at det å håndtere dem er en ferdighet du kan lære, øve på og bli bedre til. Denne modulen tar en praktisk, virkelighetsnær tilnærming for NEET-er i distriktene, og jobber seg gjennom seks enheter: hva problemløsning faktisk er og hvorfor det er viktig, å ta beslutninger under press, en praktisk verktøykasse med analyseteknikker, de skjulte kreftene som former hvordan vi tenker, hvordan hjernen din oppfører seg når du løser problemer, og en gjentakbar femtrinnsprosess du kan bruke i nesten enhver situasjon.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Lærestoff – Problemløsning",
        description:
          "<p>Hele håndboken for Modul 2. Jobb deg gjennom de seks enhetene — hva problemløsning er og hvorfor det er viktig, beslutningstaking, praktiske analyseverktøy, skjevhetene som former tenkningen vår, hjernen og problemløsning, og femtrinnsprosessen for problemløsning.</p>",
        content: "/api/uploads/pdfs/module-no-2-problem-solving-1788511673860.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktiv presentasjon – Problemløsning",
        description:
          "<p>En interaktiv gjennomgang av nøkkelbegrepene i Modul 2. Beveg deg gjennom lysbildene i ditt eget tempo.</p>",
        content: "/api/uploads/scorm/module-no-2-problem-solving-presentation-1788511690472/index.html",
      },
      {
        type: "QUIZ",
        title: "Egenvurderingstest",
        description:
          "<p>Sjekk din forståelse på tvers av alle seks enhetene — flervalg, riktig/feil og koblingsoppgaver.</p>",
        content: quiz("m2"),
      },
    ],
  },
  {
    order: 3,
    title: "3. Samarbeid",
    description:
      "<p>Samarbeid er en av de ferdighetene alle antar er lett — sett folk sammen, gi dem en oppgave, og de finner ut av det. Noen ganger gjør de det; ofte gjør de det ikke, og ingen forklarer hvorfor. Denne modulen følger en historie: en gruppe mennesker som må lære å bli et team for å fullføre et prosjekt. Du vil dekke hva som faktisk skiller et team fra en gruppe, kommunikasjon og hvor det bryter sammen, samarbeidsferdigheter, Tuckmans fem stadier for teamutvikling, håndtering av uenigheter på en konstruktiv måte, og vanene som gjør team produktive. Fokuset er praktisk hele veien — verktøy du kan bruke i en jobb, et lokalt prosjekt, en opplæring, eller hvor som helst du jobber sammen med andre.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Lærestoff – Samarbeid",
        description:
          "<p>Hele håndboken for Modul 3. Følg teamet gjennom seks delenheter — team og grupper, kommunikasjon og dens utfordringer, samarbeidsferdigheter, de fem stadiene for teamutvikling, håndtering av uenigheter, og teamets produktivitet og suksess.</p>",
        content: "/api/uploads/pdfs/module-no-3-team-work-1788511674809.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktiv presentasjon – Samarbeid",
        description:
          "<p>En interaktiv gjennomgang av nøkkelbegrepene i Modul 3. Beveg deg gjennom lysbildene i ditt eget tempo.</p>",
        content: "/api/uploads/scorm/module-no-3-team-work-presentation-1788511763459/index.html",
      },
      {
        type: "QUIZ",
        title: "Egenvurderingstest",
        description:
          "<p>Sjekk de viktigste læringspunktene — flervalg, riktig/feil og en koblingsoppgave.</p>",
        content: quiz("m3"),
      },
    ],
  },
  {
    order: 4,
    title: "4. Kommunikasjon",
    description:
      "<p>Kommunikasjon er mer enn å videreformidle informasjon — det er en kjerneferdighet for å finne arbeid, be om støtte, bygge selvtillit og komme overens med andre. Denne modulen behandler det som et sett med lærbare atferder du kan øve på og forbedre. Du vil dekke kommunikasjonsprosessen, forskjellen mellom verbal, ikke-verbal og paraverbal kommunikasjon, aktiv lytting, å uttrykke dine behov og grenser på en respektfull måte, assertivitet, å oppdage misforståelser og barrierer, å tilpasse budskapet ditt til ulike mottakere, og god kommunikasjon i profesjonelle og digitale sammenhenger — fra en melding til en arbeidsgiver til et jobbintervju eller gruppearbeid.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Lærestoff – Kommunikasjon",
        description:
          "<p>Hele håndboken for Modul 4 — kommunikasjonsprosessen, verbal, ikke-verbal og paraverbal kommunikasjon, aktiv lytting, assertivitet og grenser, kommunikasjonsbarrierer, tilpasning til ulike mottakere, og profesjonell og digital kommunikasjon.</p>",
        content: "/api/uploads/pdfs/module-no-4-communication-1788511675845.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktiv presentasjon – Kommunikasjon",
        description:
          "<p>En interaktiv gjennomgang av nøkkelbegrepene i Modul 4. Beveg deg gjennom lysbildene i ditt eget tempo.</p>",
        content: "/api/uploads/scorm/module-no-4-communication-presentation-1788511730226/index.html",
      },
      {
        type: "QUIZ",
        title: "Egenvurderingstest",
        description:
          "<p>Sjekk din forståelse — flervalg, riktig/feil og en koblingsoppgave.</p>",
        content: quiz("m4"),
      },
    ],
  },
  {
    order: 5,
    title: "5. Grunnleggende IT-ferdigheter",
    description:
      "<p>Å kunne bruke digitale verktøy er ikke lenger valgfritt — tilgang til informasjon, kontakt med institusjoner, utarbeiding av dokumenter, bruk av nettjenester og jobbsøking avhenger alle av et grunnleggende nivå av digital ferdighet. Denne modulen er en praktisk, trinnvis innføring for elever som starter med lav selvtillit. Du vil dekke digitale enheter og grunnleggende databruk, filbehandling og organisering, internettbruk og søking, e-post og nettkommunikasjon, å lage enkle dokumenter, tilgang til nettjenester, og trygg og ansvarlig bruk av digital teknologi.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Lærestoff – Grunnleggende IT-ferdigheter",
        description:
          "<p>Hele håndboken for Modul 5 — digitale enheter og grunnleggende databruk, filbehandling, internettbruk og søking, e-post og nettkommunikasjon, å lage dokumenter, tilgang til nettjenester, og trygg, ansvarlig bruk av digital teknologi.</p>",
        content: "/api/uploads/pdfs/module-no-5-basic-it-skills-1788511678974.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktiv presentasjon – Grunnleggende IT-ferdigheter",
        description:
          "<p>En interaktiv gjennomgang av nøkkelbegrepene i Modul 5. Beveg deg gjennom lysbildene i ditt eget tempo.</p>",
        content: "/api/uploads/scorm/module-no-5-basic-it-skills-presentation-1788511732755/index.html",
      },
      {
        type: "QUIZ",
        title: "Egenvurderingstest",
        description:
          "<p>Sjekk din forståelse — flervalg, riktig/feil og en koblingsoppgave.</p>",
        content: quiz("m5"),
      },
    ],
  },
  {
    order: 6,
    title: "6. Selvbevissthet",
    description:
      "<p>Selvbevissthet er å kjenne dine egne tanker, følelser, styrker, verdier og atferdsmønstre — og å se hvordan de former valgene du tar om arbeid, læring og liv. For unge mennesker i distriktene som møter usikkerhet og begrensede muligheter, er det et praktisk grunnlag for trygge beslutninger. Denne modulen jobber seg gjennom seks delenheter: å forstå selvbevissthet, følelser og selvregulering, styrker, verdier og motivasjon, selvbevissthet i arbeidsmarkedet, kommunikasjon og hvordan andre ser oss, og å gjøre selvbevissthet om til handling.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Lærestoff – Selvbevissthet",
        description:
          "<p>Hele håndboken for Modul 6 — å forstå selvbevissthet, følelser og selvregulering, styrker, verdier og motivasjon, selvbevissthet i arbeidsmarkedet, kommunikasjon og ekstern selvbevissthet, og overgangen fra selvbevissthet til handling.</p>",
        content: "/api/uploads/pdfs/module-no-6-self-awareness-1788511679614.pdf",
      },
      {
        type: "SCORM",
        title: "Interaktiv presentasjon – Selvbevissthet",
        description:
          "<p>En interaktiv gjennomgang av nøkkelbegrepene i Modul 6. Beveg deg gjennom lysbildene i ditt eget tempo.</p>",
        content: "/api/uploads/scorm/module-no-6-self-awareness-presentation-1788511739347/index.html",
      },
      {
        type: "QUIZ",
        title: "Egenvurderingstest",
        description:
          "<p>Sjekk din forståelse — flervalg, riktig/feil og en koblingsoppgave.</p>",
        content: quiz("m6"),
      },
    ],
  },
];

async function main() {
  for (const m of modules) {
    const existing = await prisma.module.findFirst({
      where: { language: "no", title: m.title },
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
        language: "no",
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
