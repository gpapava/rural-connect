import { getTranslations } from "next-intl/server";
import JobPostForm from "@/components/JobPostForm";
import BrandMark from "@/components/BrandMark";
import FundingBanner from "@/components/FundingBanner";

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
            <BrandMark className="h-10 w-10" rounded="rounded-xl" />
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
        <FundingBanner className="mt-8" />
      </div>
    </div>
  );
}
