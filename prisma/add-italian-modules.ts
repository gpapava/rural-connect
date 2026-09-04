/**
 * Seeds the six Italian (it) curriculum modules and their lessons.
 *
 * Idempotent: matched by (language "it", title). If a module already exists it
 * is left untouched — delete it by hand first if you want to re-import.
 *
 * PDF and SCORM assets are already uploaded to the production server; the URLs
 * below point at them. Run with:  npx tsx prisma/add-italian-modules.ts
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
    JSON.parse(readFileSync(join(__dirname, "italian-quizzes", `${m}.json`), "utf8"))
  );

const modules: ModuleSeed[] = [
  {
    order: 1,
    title: "1. Gestione del Tempo",
    description:
      "<p>Questo modulo offre una tabella di marcia completa affinché i giovani NEET delle zone rurali possano riprendere il controllo della loro vita quotidiana. In contesti in cui il lavoro strutturato è scarso, il tempo può diventare un nemico (portando a isolamento e apatia) oppure un alleato strategico. Esploriamo la transizione dall'esistenza passiva all'autogestione attiva, concentrandoci sulle specifiche barriere logistiche e psicologiche del contesto rurale.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Materiale di Studio – Gestione del Tempo",
        description:
          "<p>Il manuale completo del Modulo 1. Lavora sulle quattro sottounità: il Paradosso del Tempo Rurale, la definizione degli obiettivi SMART/PURE, la Matrice di Eisenhower e come sconfiggere la procrastinazione.</p>",
        content: "/api/uploads/pdfs/module-it-1-time-management-1788509226545.pdf",
      },
      {
        type: "SCORM",
        title: "Presentazione Interattiva – Gestione del Tempo",
        description:
          "<p>Un percorso interattivo tra i concetti chiave del Modulo 1. Avanza tra le diapositive al tuo ritmo.</p>",
        content: "/api/uploads/scorm/module-it-1-time-management-presentation-1788509236397/index.html",
      },
      {
        type: "QUIZ",
        title: "Quiz di Autovalutazione",
        description:
          "<p>Verifica la tua comprensione del Modulo 1. Domande a risposta multipla, vero/falso e di abbinamento — puoi ripeterlo tutte le volte che vuoi.</p>",
        content: quiz("m1"),
      },
    ],
  },
  {
    order: 2,
    title: "2. Problem Solving",
    description:
      "<p>I problemi fanno parte della vita — perdere l'autobus, restare senza soldi prima della fine del mese, non sapere cosa dire a un colloquio di lavoro. La buona notizia è che affrontarli è una competenza che puoi imparare, esercitare e migliorare. Questo modulo adotta un approccio pratico e concreto per i NEET delle zone rurali, attraverso sei unità: che cos'è davvero il problem solving e perché è importante, prendere decisioni sotto pressione, una cassetta degli attrezzi di tecniche di analisi, le forze nascoste che modellano il nostro modo di pensare, come si comporta il tuo cervello quando risolvi problemi, e un processo ripetibile in cinque passi applicabile a quasi ogni situazione.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Materiale di Studio – Problem Solving",
        description:
          "<p>Il manuale completo del Modulo 2. Lavora sulle sei unità — che cos'è il problem solving e perché è importante, il processo decisionale, strumenti pratici di analisi, i bias che modellano il nostro pensiero, il cervello e il problem solving, e il processo di problem solving in cinque passi.</p>",
        content: "/api/uploads/pdfs/module-it-2-problem-solving-1788509227749.pdf",
      },
      {
        type: "SCORM",
        title: "Presentazione Interattiva – Problem Solving",
        description:
          "<p>Un percorso interattivo tra i concetti chiave del Modulo 2. Avanza tra le diapositive al tuo ritmo.</p>",
        content: "/api/uploads/scorm/module-it-2-problem-solving-presentation-1788509240585/index.html",
      },
      {
        type: "QUIZ",
        title: "Quiz di Autovalutazione",
        description:
          "<p>Verifica la tua comprensione di tutte e sei le unità — domande a risposta multipla, vero/falso e di abbinamento.</p>",
        content: quiz("m2"),
      },
    ],
  },
  {
    order: 3,
    title: "3. Lavoro di Squadra",
    description:
      "<p>Il lavoro di squadra è una di quelle competenze che tutti danno per facili — metti insieme delle persone, assegni un compito e se la caveranno. A volte succede; spesso no, e nessuno spiega perché. Questo modulo segue una storia: un gruppo di persone che deve imparare a diventare una squadra per portare a termine un progetto. Affronterai cosa distingue davvero una squadra da un gruppo, la comunicazione e dove si inceppa, le competenze di collaborazione, i cinque stadi di sviluppo di una squadra secondo Tuckman, la gestione costruttiva dei disaccordi, e le abitudini che rendono le squadre produttive. L'approccio è pratico per tutto il percorso — strumenti che puoi usare in un lavoro, in un progetto di comunità, in un corso di formazione o ovunque tu lavori insieme ad altre persone.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Materiale di Studio – Lavoro di Squadra",
        description:
          "<p>Il manuale completo del Modulo 3. Segui la squadra attraverso sei sottounità — squadre e gruppi, la comunicazione e le sue sfide, le competenze di collaborazione, i cinque stadi di sviluppo di una squadra, la gestione dei disaccordi, e la produttività e il successo della squadra.</p>",
        content: "/api/uploads/pdfs/module-it-3-team-work-1788509228973.pdf",
      },
      {
        type: "SCORM",
        title: "Presentazione Interattiva – Lavoro di Squadra",
        description:
          "<p>Un percorso interattivo tra i concetti chiave del Modulo 3. Avanza tra le diapositive al tuo ritmo.</p>",
        content: "/api/uploads/scorm/module-it-3-team-work-presentation-1788509254356/index.html",
      },
      {
        type: "QUIZ",
        title: "Quiz di Autovalutazione",
        description:
          "<p>Verifica i punti chiave dell'apprendimento — domande a risposta multipla, vero/falso e una domanda di abbinamento.</p>",
        content: quiz("m3"),
      },
    ],
  },
  {
    order: 4,
    title: "4. Comunicazione",
    description:
      "<p>La comunicazione è molto più che trasmettere informazioni — è una competenza fondamentale per trovare lavoro, chiedere sostegno, costruire fiducia in sé stessi e andare d'accordo con gli altri. Questo modulo la tratta come un insieme di comportamenti apprendibili che puoi esercitare e migliorare. Affronterai il processo di comunicazione, la differenza tra comunicazione verbale, non verbale e paraverbale, l'ascolto attivo, l'espressione rispettosa dei tuoi bisogni e confini, l'assertività, il riconoscimento di malintesi e barriere, l'adattamento del messaggio a interlocutori diversi, e la buona comunicazione in contesti professionali e digitali — da un messaggio a un datore di lavoro fino a un colloquio di lavoro o a un lavoro di gruppo.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Materiale di Studio – Comunicazione",
        description:
          "<p>Il manuale completo del Modulo 4 — il processo di comunicazione, la comunicazione verbale, non verbale e paraverbale, l'ascolto attivo, l'assertività e i confini, le barriere comunicative, l'adattamento a interlocutori diversi, e la comunicazione professionale e digitale.</p>",
        content: "/api/uploads/pdfs/module-it-4-communication-1788509229782.pdf",
      },
      {
        type: "SCORM",
        title: "Presentazione Interattiva – Comunicazione",
        description:
          "<p>Un percorso interattivo tra i concetti chiave del Modulo 4. Avanza tra le diapositive al tuo ritmo.</p>",
        content: "/api/uploads/scorm/module-it-4-communication-presentation-1788509258544/index.html",
      },
      {
        type: "QUIZ",
        title: "Quiz di Autovalutazione",
        description:
          "<p>Verifica la tua comprensione — domande a risposta multipla, vero/falso e una domanda di abbinamento.</p>",
        content: quiz("m4"),
      },
    ],
  },
  {
    order: 5,
    title: "5. Competenze Digitali di Base",
    description:
      "<p>Saper usare gli strumenti digitali non è più facoltativo — accedere alle informazioni, contattare le istituzioni, preparare documenti, usare i servizi online e cercare lavoro dipendono tutti da un livello di base di competenza digitale. Questo modulo è un'introduzione pratica, passo dopo passo, per chi parte con poca sicurezza. Affronterai i dispositivi digitali e l'uso di base del computer, la gestione e l'organizzazione dei file, l'uso di Internet e la ricerca, l'email e la comunicazione online, la creazione di documenti semplici, l'accesso ai servizi online, e l'uso sicuro e responsabile della tecnologia digitale.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Materiale di Studio – Competenze Digitali di Base",
        description:
          "<p>Il manuale completo del Modulo 5 — i dispositivi digitali e l'uso di base del computer, la gestione dei file, l'uso di Internet e la ricerca, l'email e la comunicazione online, la creazione di documenti, l'accesso ai servizi online, e l'uso sicuro e responsabile della tecnologia digitale.</p>",
        content: "/api/uploads/pdfs/module-it-5-basic-it-skills-1788509230713.pdf",
      },
      {
        type: "SCORM",
        title: "Presentazione Interattiva – Competenze Digitali di Base",
        description:
          "<p>Un percorso interattivo tra i concetti chiave del Modulo 5. Avanza tra le diapositive al tuo ritmo.</p>",
        content: "/api/uploads/scorm/module-it-5-basic-it-skills-presentation-1788509261154/index.html",
      },
      {
        type: "QUIZ",
        title: "Quiz di Autovalutazione",
        description:
          "<p>Verifica la tua comprensione — domande a risposta multipla, vero/falso e una domanda di abbinamento.</p>",
        content: quiz("m5"),
      },
    ],
  },
  {
    order: 6,
    title: "6. Consapevolezza di Sé",
    description:
      "<p>La consapevolezza di sé è conoscere i propri pensieri, emozioni, punti di forza, valori e schemi di comportamento — e vedere come questi modellano le scelte che fai riguardo al lavoro, all'apprendimento e alla vita. Per i giovani delle zone rurali che affrontano incertezza e opportunità limitate, è una base pratica per prendere decisioni con sicurezza. Questo modulo si sviluppa in sei sottounità: comprendere la consapevolezza di sé, le emozioni e l'autoregolazione, i punti di forza, i valori e la motivazione, la consapevolezza di sé nel mercato del lavoro, la comunicazione e come ci vedono gli altri, e trasformare la consapevolezza di sé in azione.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Materiale di Studio – Consapevolezza di Sé",
        description:
          "<p>Il manuale completo del Modulo 6 — comprendere la consapevolezza di sé, le emozioni e l'autoregolazione, i punti di forza, i valori e la motivazione, la consapevolezza di sé nel mercato del lavoro, la comunicazione e la consapevolezza esterna di sé, e il passaggio dalla consapevolezza di sé all'azione.</p>",
        content: "/api/uploads/pdfs/module-it-6-self-awareness-1788509232553.pdf",
      },
      {
        type: "SCORM",
        title: "Presentazione Interattiva – Consapevolezza di Sé",
        description:
          "<p>Un percorso interattivo tra i concetti chiave del Modulo 6. Avanza tra le diapositive al tuo ritmo.</p>",
        content: "/api/uploads/scorm/module-it-6-self-awareness-presentation-1788509273968/index.html",
      },
      {
        type: "QUIZ",
        title: "Quiz di Autovalutazione",
        description:
          "<p>Verifica la tua comprensione — domande a risposta multipla, vero/falso e una domanda di abbinamento.</p>",
        content: quiz("m6"),
      },
    ],
  },
];

async function main() {
  for (const m of modules) {
    const existing = await prisma.module.findFirst({
      where: { language: "it", title: m.title },
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
        language: "it",
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
