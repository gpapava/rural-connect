import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CertificateView from "@/components/CertificateView";

interface PageProps {
  params: { locale: string; id: string };
}

export default async function CertificatePage({ params: { locale, id } }: PageProps) {
  const session = await auth();
  if (!session) redirect(`/${locale}/auth/login`);

  const cert = await prisma.certificate.findUnique({
    where: { id },
    include: {
      neetUser:  { select: { id: true, name: true, country: true } },
      counselor: { select: { id: true, name: true } },
    },
  });

  if (!cert) notFound();

  // Only the NEET user or their counsellor may view
  if (session.user.id !== cert.neetUserId && session.user.id !== cert.counselorId) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <CertificateView
      id={cert.id}
      neetName={cert.neetUser.name}
      counselorName={cert.counselor.name}
      issuedAt={cert.issuedAt}
    />
  );
}
