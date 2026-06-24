import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");

  const jobs = await prisma.jobOpening.findMany({
    where: {
      status: "APPROVED",
      ...(country && country !== "all" ? { country } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const { title, company, description, country, location, contactName, contactEmail, website } =
    await req.json();

  if (!title?.trim() || !company?.trim() || !description?.trim() || !country?.trim() || !contactName?.trim() || !contactEmail?.trim())
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });

  const job = await prisma.jobOpening.create({
    data: {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      country: country.trim(),
      location: location?.trim() || null,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      website: website?.trim() || null,
      status: "PENDING",
    },
  });

  return NextResponse.json({ job }, { status: 201 });
}
