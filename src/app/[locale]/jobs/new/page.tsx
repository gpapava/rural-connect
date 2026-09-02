import { getTranslations } from "next-intl/server";
import JobPostForm from "@/components/JobPostForm";

interface PageProps {
  params: { locale: string };
}

export default async function PostJobPage({ params: { locale } }: PageProps) {
  const t = await getTranslations({ locale, namespace: "jobPost" });
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a73e8]">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-widest text-gray-900">RURAL-CONNECT</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("pageTitle")}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {t("pageSubtitle")}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <JobPostForm />
        </div>
      </div>
    </div>
  );
}
