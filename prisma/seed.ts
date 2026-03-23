import { PrismaClient, UserRole, ModuleProgressStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ruralconnect.eu" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@ruralconnect.eu",
      passwordHash: adminHash,
      role: UserRole.ADMIN,
      country: "EU",
      language: "en",
    },
  });

  // Create counselor
  const counselorHash = await bcrypt.hash("counselor123", 12);
  const counselor = await prisma.user.upsert({
    where: { email: "counselor@ruralconnect.eu" },
    update: {},
    create: {
      name: "Maria Papadopoulou",
      email: "counselor@ruralconnect.eu",
      passwordHash: counselorHash,
      role: UserRole.COUNSELOR,
      country: "GR",
      language: "el",
    },
  });

  // Create NEET user
  const neetHash = await bcrypt.hash("neet123", 12);
  const neetUser = await prisma.user.upsert({
    where: { email: "user@ruralconnect.eu" },
    update: {},
    create: {
      name: "Alex Johnson",
      email: "user@ruralconnect.eu",
      passwordHash: neetHash,
      role: UserRole.NEET_USER,
      country: "NO",
      language: "no",
    },
  });

  // Create portfolio for NEET user
  const portfolio = await prisma.portfolioEntry.upsert({
    where: { userId: neetUser.id },
    update: {},
    create: {
      userId: neetUser.id,
      summary:
        "Motivated young professional seeking opportunities in the agricultural and technology sectors. Experienced in community work and eager to develop digital skills.",
      targetSector: "Agriculture & Technology",
      neetStatus: "Unemployed - seeking first job",
      skills: "Communication, Teamwork, Basic IT, Driving License",
      contactPhone: "+47 123 456 78",
      contactAddress: "Rural Municipality, Norway",
    },
  });

  await prisma.qualification.createMany({
    data: [
      {
        portfolioId: portfolio.id,
        title: "Upper Secondary School Certificate",
        institution: "Rural High School",
        status: "completed",
        completedAt: new Date("2022-06-15"),
      },
      {
        portfolioId: portfolio.id,
        title: "Basic Digital Skills Certificate",
        institution: "Online Platform",
        status: "completed",
        completedAt: new Date("2023-03-10"),
      },
      {
        portfolioId: portfolio.id,
        title: "Vocational Training - Agriculture",
        institution: "Regional Training Centre",
        status: "in_progress",
        completedAt: null,
      },
    ],
    skipDuplicates: true,
  });

  // Create modules
  const modules = await Promise.all([
    prisma.module.upsert({
      where: { id: "module-1" },
      update: {},
      create: {
        id: "module-1",
        title: "Introduction to Digital Skills",
        description:
          "Learn the fundamentals of using computers, internet, and digital tools for everyday tasks and job searching.",
        order: 1,
        category: "Digital Skills",
        duration: 120,
      },
    }),
    prisma.module.upsert({
      where: { id: "module-2" },
      update: {},
      create: {
        id: "module-2",
        title: "CV Writing & Job Applications",
        description:
          "Master the art of creating professional CVs and compelling job applications tailored to rural and agricultural sectors.",
        order: 2,
        category: "Career Development",
        duration: 90,
      },
    }),
    prisma.module.upsert({
      where: { id: "module-3" },
      update: {},
      create: {
        id: "module-3",
        title: "Interview Skills & Confidence Building",
        description:
          "Build confidence and learn practical interview techniques through mock sessions and video exercises.",
        order: 3,
        category: "Career Development",
        duration: 150,
      },
    }),
    prisma.module.upsert({
      where: { id: "module-4" },
      update: {},
      create: {
        id: "module-4",
        title: "Financial Literacy for Young Adults",
        description:
          "Understand budgeting, savings, taxes, and financial planning essentials for independent living.",
        order: 4,
        category: "Life Skills",
        duration: 100,
      },
    }),
    prisma.module.upsert({
      where: { id: "module-5" },
      update: {},
      create: {
        id: "module-5",
        title: "Entrepreneurship in Rural Areas",
        description:
          "Explore opportunities for self-employment and small business development in rural communities.",
        order: 5,
        category: "Entrepreneurship",
        duration: 180,
      },
    }),
    prisma.module.upsert({
      where: { id: "module-6" },
      update: {},
      create: {
        id: "module-6",
        title: "Sustainable Agriculture & Green Jobs",
        description:
          "Discover career opportunities in sustainable farming, forestry, and the green economy.",
        order: 6,
        category: "Agriculture",
        duration: 120,
      },
    }),
  ]);

  // Create user module progress
  await prisma.userModuleProgress.createMany({
    data: [
      {
        userId: neetUser.id,
        moduleId: modules[0].id,
        status: ModuleProgressStatus.COMPLETED,
        completedAt: new Date("2024-01-15"),
      },
      {
        userId: neetUser.id,
        moduleId: modules[1].id,
        status: ModuleProgressStatus.IN_PROGRESS,
      },
      {
        userId: neetUser.id,
        moduleId: modules[2].id,
        status: ModuleProgressStatus.NOT_STARTED,
      },
    ],
    skipDuplicates: true,
  });

  // Create counseling session
  const session = await prisma.counselingSession.create({
    data: {
      neetUserId: neetUser.id,
      counselorId: counselor.id,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: "SCHEDULED",
      notes: "Initial assessment session. Discuss career goals and barriers.",
      actionPlan:
        "1. Complete digital skills module\n2. Update CV\n3. Research local employers",
    },
  });

  // Create messages
  await prisma.message.createMany({
    data: [
      {
        sessionId: session.id,
        senderId: counselor.id,
        content: "Hello Alex! Welcome to RURAL-CONNECT. How are you today?",
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        sessionId: session.id,
        senderId: neetUser.id,
        content:
          "Hi Maria! I'm doing well, thank you. I'm excited to start this program.",
        createdAt: new Date(Date.now() - 3500000),
      },
      {
        sessionId: session.id,
        senderId: counselor.id,
        content:
          "Great! I've reviewed your profile. Let's start by discussing your career interests in agriculture and technology.",
        createdAt: new Date(Date.now() - 3400000),
      },
    ],
  });

  // Create labor market links
  await prisma.laborMarketLink.createMany({
    data: [
      {
        country: "NO",
        agencyName: "NAV - Norwegian Labour and Welfare Administration",
        url: "https://www.nav.no/en/home",
        description:
          "Norway's main public employment service offering job listings, benefits, and career guidance.",
        tags: "employment,benefits,career",
      },
      {
        country: "GR",
        agencyName: "DYPA - Public Employment Service of Greece",
        url: "https://www.dypa.gov.gr",
        description:
          "Greek public employment service with job vacancies, training programs, and unemployment support.",
        tags: "employment,training,benefits",
      },
      {
        country: "TR",
        agencyName: "ISKUR - Turkish Employment Agency",
        url: "https://www.iskur.gov.tr",
        description:
          "Turkish employment agency providing job placement, vocational training and unemployment benefits.",
        tags: "employment,vocational,training",
      },
      {
        country: "LV",
        agencyName: "NVA - State Employment Agency Latvia",
        url: "https://www.nva.gov.lv",
        description:
          "Latvian state employment agency offering vacancies, career counseling, and retraining programs.",
        tags: "employment,career,counseling",
      },
      {
        country: "ES",
        agencyName: "SEPE - State Public Employment Service Spain",
        url: "https://www.sepe.es",
        description:
          "Spanish public employment service managing job offers, unemployment benefits, and training.",
        tags: "employment,benefits,training",
      },
      {
        country: "IT",
        agencyName: "ANPAL - National Agency for Active Labour Market Policies",
        url: "https://www.anpal.gov.it",
        description:
          "Italian agency coordinating employment policies and active labour market programs.",
        tags: "employment,policy,programs",
      },
      {
        country: "EU",
        agencyName: "EURES - European Job Mobility Portal",
        url: "https://eures.europa.eu",
        description:
          "EU-wide job portal helping workers find employment opportunities across Europe.",
        tags: "eu,mobility,jobs",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed successfully!");
  console.log("\nTest accounts:");
  console.log("  Admin:     admin@ruralconnect.eu / admin123");
  console.log("  Counselor: counselor@ruralconnect.eu / counselor123");
  console.log("  NEET User: user@ruralconnect.eu / neet123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
