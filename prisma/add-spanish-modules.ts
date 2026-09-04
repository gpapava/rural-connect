/**
 * Seeds the six Spanish (es) curriculum modules and their lessons.
 *
 * Idempotent: matched by (language "es", title). If a module already exists it
 * is left untouched — delete it by hand first if you want to re-import.
 *
 * PDF and SCORM assets are already uploaded to the production server; the URLs
 * below point at them. Run with:  npx tsx prisma/add-spanish-modules.ts
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
    JSON.parse(readFileSync(join(__dirname, "spanish-quizzes", `${m}.json`), "utf8"))
  );

const modules: ModuleSeed[] = [
  {
    order: 1,
    title: "1. Gestión del Tiempo",
    description:
      "<p>Este módulo ofrece una hoja de ruta completa para que los jóvenes NEET de zonas rurales recuperen el control de su vida diaria. En entornos donde el empleo estructurado es escaso, el tiempo puede convertirse en un enemigo (que lleva al aislamiento y la apatía) o en un aliado estratégico. Exploramos la transición de una existencia pasiva a una autogestión activa, centrándonos en las barreras logísticas y psicológicas específicas del entorno rural.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Material de Estudio – Gestión del Tiempo",
        description:
          "<p>El manual completo del Módulo 1. Trabaja las cuatro subunidades sobre la Paradoja del Tiempo Rural, la fijación de objetivos SMART/PURE, la Matriz de Eisenhower y cómo vencer la procrastinación.</p>",
        content: "/api/uploads/pdfs/module-es-1-time-management-1788512443629.pdf",
      },
      {
        type: "SCORM",
        title: "Presentación Interactiva – Gestión del Tiempo",
        description:
          "<p>Un recorrido interactivo por los conceptos clave del Módulo 1. Avanza por las diapositivas a tu propio ritmo.</p>",
        content: "/api/uploads/scorm/module-es-1-time-management-presentation-1788512455643/index.html",
      },
      {
        type: "QUIZ",
        title: "Cuestionario de Autoevaluación",
        description:
          "<p>Comprueba tu comprensión del Módulo 1. Preguntas de opción múltiple, verdadero/falso y de correspondencia — puedes repetirlo tantas veces como quieras.</p>",
        content: quiz("m1"),
      },
    ],
  },
  {
    order: 2,
    title: "2. Resolución de Problemas",
    description:
      "<p>Los problemas son parte de la vida — perder el autobús, quedarse sin dinero antes de fin de mes, no saber qué decir en una entrevista de trabajo. La buena noticia es que afrontarlos es una habilidad que puedes aprender, practicar y mejorar. Este módulo adopta un enfoque práctico y realista para los NEET de zonas rurales, a través de seis unidades: qué es realmente la resolución de problemas y por qué importa, tomar decisiones bajo presión, una caja de herramientas práctica de técnicas de análisis, las fuerzas ocultas que moldean cómo pensamos, cómo se comporta tu cerebro cuando resuelves problemas, y un proceso repetible de cinco pasos que puedes aplicar a casi cualquier situación.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Material de Estudio – Resolución de Problemas",
        description:
          "<p>El manual completo del Módulo 2. Trabaja las seis unidades — qué es la resolución de problemas y por qué importa, la toma de decisiones, herramientas prácticas de análisis, los sesgos que moldean nuestro pensamiento, el cerebro y la resolución de problemas, y el proceso de resolución de problemas en cinco pasos.</p>",
        content: "/api/uploads/pdfs/module-es-2-problem-solving-1788512444542.pdf",
      },
      {
        type: "SCORM",
        title: "Presentación Interactiva – Resolución de Problemas",
        description:
          "<p>Un recorrido interactivo por los conceptos clave del Módulo 2. Avanza por las diapositivas a tu propio ritmo.</p>",
        content: "/api/uploads/scorm/module-es-2-problem-solving-presentation-1788512462301/index.html",
      },
      {
        type: "QUIZ",
        title: "Cuestionario de Autoevaluación",
        description:
          "<p>Comprueba tu comprensión de las seis unidades — preguntas de opción múltiple, verdadero/falso y de correspondencia.</p>",
        content: quiz("m2"),
      },
    ],
  },
  {
    order: 3,
    title: "3. Trabajo en Equipo",
    description:
      "<p>El trabajo en equipo es una de esas habilidades que todo el mundo da por sentado que es fácil — pones a personas juntas, les das una tarea y se las arreglarán. A veces lo hacen; a menudo no, y nadie explica por qué. Este módulo sigue una historia: un grupo de personas que deben aprender a convertirse en equipo para terminar un proyecto. Cubrirás qué separa realmente a un equipo de un grupo, la comunicación y dónde falla, las habilidades de colaboración, las cinco etapas de desarrollo de equipos de Tuckman, la gestión constructiva de los desacuerdos, y los hábitos que hacen productivos a los equipos. El enfoque es práctico en todo momento — herramientas que puedes usar en un trabajo, un proyecto comunitario, una formación, o en cualquier lugar donde trabajes junto a otras personas.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Material de Estudio – Trabajo en Equipo",
        description:
          "<p>El manual completo del Módulo 3. Sigue al equipo a través de seis subunidades — equipos y grupos, la comunicación y sus retos, las habilidades de colaboración, las cinco etapas de desarrollo de equipos, la gestión de los desacuerdos, y la productividad y el éxito del equipo.</p>",
        content: "/api/uploads/pdfs/module-es-3-team-work-1788512445870.pdf",
      },
      {
        type: "SCORM",
        title: "Presentación Interactiva – Trabajo en Equipo",
        description:
          "<p>Un recorrido interactivo por los conceptos clave del Módulo 3. Avanza por las diapositivas a tu propio ritmo.</p>",
        content: "/api/uploads/scorm/module-es-3-team-work-presentation-1788512478726/index.html",
      },
      {
        type: "QUIZ",
        title: "Cuestionario de Autoevaluación",
        description:
          "<p>Comprueba los puntos clave de aprendizaje — preguntas de opción múltiple, verdadero/falso y una pregunta de correspondencia.</p>",
        content: quiz("m3"),
      },
    ],
  },
  {
    order: 4,
    title: "4. Comunicación",
    description:
      "<p>La comunicación es más que transmitir información — es una habilidad esencial para encontrar trabajo, pedir apoyo, ganar confianza y llevarse bien con los demás. Este módulo la trata como un conjunto de comportamientos que se pueden aprender, practicar y mejorar. Cubrirás el proceso de comunicación, la diferencia entre comunicación verbal, no verbal y paraverbal, la escucha activa, expresar tus necesidades y límites con respeto, la asertividad, detectar malentendidos y barreras, adaptar tu mensaje a distintos interlocutores, y comunicarte bien en contextos profesionales y digitales — desde un mensaje a un empleador hasta una entrevista de trabajo o un trabajo en grupo.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Material de Estudio – Comunicación",
        description:
          "<p>El manual completo del Módulo 4 — el proceso de comunicación, la comunicación verbal, no verbal y paraverbal, la escucha activa, la asertividad y los límites, las barreras de comunicación, la adaptación a distintos interlocutores, y la comunicación profesional y digital.</p>",
        content: "/api/uploads/pdfs/module-es-4-communication-1788512447022.pdf",
      },
      {
        type: "SCORM",
        title: "Presentación Interactiva – Comunicación",
        description:
          "<p>Un recorrido interactivo por los conceptos clave del Módulo 4. Avanza por las diapositivas a tu propio ritmo.</p>",
        content: "/api/uploads/scorm/module-es-4-communication-presentation-1788512513749/index.html",
      },
      {
        type: "QUIZ",
        title: "Cuestionario de Autoevaluación",
        description:
          "<p>Comprueba tu comprensión — preguntas de opción múltiple, verdadero/falso y una pregunta de correspondencia.</p>",
        content: quiz("m4"),
      },
    ],
  },
  {
    order: 5,
    title: "5. Competencias Digitales Básicas",
    description:
      "<p>Saber usar herramientas digitales ya no es opcional — acceder a información, contactar con instituciones, preparar documentos, usar servicios en línea y buscar trabajo dependen todos de un nivel básico de competencia digital. Este módulo es una introducción práctica, paso a paso, para personas que parten con poca confianza. Cubrirás los dispositivos digitales y el uso básico del ordenador, la gestión y organización de archivos, el uso de internet y la búsqueda, el correo electrónico y la comunicación en línea, la creación de documentos sencillos, el acceso a servicios en línea, y el uso seguro y responsable de la tecnología digital.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Material de Estudio – Competencias Digitales Básicas",
        description:
          "<p>El manual completo del Módulo 5 — los dispositivos digitales y el uso básico del ordenador, la gestión de archivos, el uso de internet y la búsqueda, el correo electrónico y la comunicación en línea, la creación de documentos, el acceso a servicios en línea, y el uso seguro y responsable de la tecnología digital.</p>",
        content: "/api/uploads/pdfs/module-es-5-basic-it-skills-1788512448364.pdf",
      },
      {
        type: "SCORM",
        title: "Presentación Interactiva – Competencias Digitales Básicas",
        description:
          "<p>Un recorrido interactivo por los conceptos clave del Módulo 5. Avanza por las diapositivas a tu propio ritmo.</p>",
        content: "/api/uploads/scorm/module-es-5-basic-it-skills-presentation-1788512490088/index.html",
      },
      {
        type: "QUIZ",
        title: "Cuestionario de Autoevaluación",
        description:
          "<p>Comprueba tu comprensión — preguntas de opción múltiple, verdadero/falso y una pregunta de correspondencia.</p>",
        content: quiz("m5"),
      },
    ],
  },
  {
    order: 6,
    title: "6. Autoconocimiento",
    description:
      "<p>El autoconocimiento es conocer tus propios pensamientos, emociones, fortalezas, valores y patrones de comportamiento — y ver cómo moldean las decisiones que tomas sobre el trabajo, el aprendizaje y la vida. Para los jóvenes de zonas rurales que se enfrentan a la incertidumbre y a oportunidades limitadas, es una base práctica para tomar decisiones con confianza. Este módulo trabaja seis subunidades: comprender el autoconocimiento, las emociones y la autorregulación, las fortalezas, los valores y la motivación, el autoconocimiento en el mercado laboral, la comunicación y cómo nos ven los demás, y convertir el autoconocimiento en acción.</p>",
    lessons: [
      {
        type: "PDF",
        title: "Material de Estudio – Autoconocimiento",
        description:
          "<p>El manual completo del Módulo 6 — comprender el autoconocimiento, las emociones y la autorregulación, las fortalezas, los valores y la motivación, el autoconocimiento en el mercado laboral, la comunicación y el autoconocimiento externo, y el paso del autoconocimiento a la acción.</p>",
        content: "/api/uploads/pdfs/module-es-6-self-awareness-1788512449752.pdf",
      },
      {
        type: "SCORM",
        title: "Presentación Interactiva – Autoconocimiento",
        description:
          "<p>Un recorrido interactivo por los conceptos clave del Módulo 6. Avanza por las diapositivas a tu propio ritmo.</p>",
        content: "/api/uploads/scorm/module-es-6-self-awareness-presentation-1788512498954/index.html",
      },
      {
        type: "QUIZ",
        title: "Cuestionario de Autoevaluación",
        description:
          "<p>Comprueba tu comprensión — preguntas de opción múltiple, verdadero/falso y una pregunta de correspondencia.</p>",
        content: quiz("m6"),
      },
    ],
  },
];

async function main() {
  for (const m of modules) {
    const existing = await prisma.module.findFirst({
      where: { language: "es", title: m.title },
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
        language: "es",
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
