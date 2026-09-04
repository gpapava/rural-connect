import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

// One-time database seeding route. Delete this file after running.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (token !== process.env.SETUP_TOKEN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
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

    const portfolio = await prisma.portfolioEntry.upsert({
      where: { userId: neetUser.id },
      update: {},
      create: {
        userId: neetUser.id,
        summary: "Motivated young professional seeking opportunities in the agricultural and technology sectors.",
        targetSector: "Agriculture & Technology",
        neetStatus: "Unemployed - seeking first job",
        skills: "Communication, Teamwork, Basic IT, Driving License",
        contactPhone: "+47 123 456 78",
        contactAddress: "Rural Municipality, Norway",
      },
    });

    await prisma.qualification.createMany({
      data: [
        { portfolioId: portfolio.id, title: "Upper Secondary School Certificate", institution: "Rural High School", status: "completed", completedAt: new Date("2022-06-15") },
        { portfolioId: portfolio.id, title: "Basic Digital Skills Certificate", institution: "Online Platform", status: "completed", completedAt: new Date("2023-03-10") },
        { portfolioId: portfolio.id, title: "Vocational Training - Agriculture", institution: "Regional Training Centre", status: "in_progress", completedAt: null },
      ],
      skipDuplicates: true,
    });

    // Curriculum modules are seeded per language via prisma/add-<lang>-modules.ts;
    // no demo/placeholder modules are created here.

    const session = await prisma.counselingSession.create({
      data: {
        neetUserId: neetUser.id,
        counselorId: counselor.id,
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "SCHEDULED",
        notes: "Initial assessment session.",
        actionPlan: "1. Complete digital skills module\n2. Update CV",
      },
    });

    await prisma.message.createMany({
      data: [
        { sessionId: session.id, senderId: counselor.id, content: "Hello Alex! Welcome to RURAL-CONNECT.", createdAt: new Date(Date.now() - 3600000) },
        { sessionId: session.id, senderId: neetUser.id, content: "Hi Maria! I'm excited to start this program.", createdAt: new Date(Date.now() - 3500000) },
      ],
    });

    await prisma.laborMarketLink.createMany({
      data: [
        { country: "NO", agencyName: "NAV - Norwegian Labour and Welfare Administration", url: "https://www.nav.no/en/home", description: "Norway's main public employment service.", tags: "employment,benefits,career" },
        { country: "GR", agencyName: "DYPA - Public Employment Service of Greece", url: "https://www.dypa.gov.gr", description: "Greek public employment service.", tags: "employment,training,benefits" },
        { country: "EU", agencyName: "EURES - European Job Mobility Portal", url: "https://eures.europa.eu", description: "EU-wide job portal.", tags: "eu,mobility,jobs" },
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({
      ok: true,
      message: "Database seeded successfully. Delete /api/setup after this.",
      accounts: {
        admin: "admin@ruralconnect.eu / admin123",
        counselor: "counselor@ruralconnect.eu / counselor123",
        neet: "user@ruralconnect.eu / neet123",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
