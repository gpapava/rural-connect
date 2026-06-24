import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import RegisterForm from "@/components/RegisterForm";

interface RegisterPageProps {
  params: { locale: string };
}

export default async function RegisterPage({ params: { locale } }: RegisterPageProps) {
  const session = await auth();

  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1e293b] flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a73e8]">
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-wider">RURAL-CONNECT</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight">Join Rural-Connect</h2>
          <p className="mb-8 text-slate-300 leading-relaxed">
            Create your account and start accessing digital counseling, skills development, and
            employment pathways designed for NEET youth in rural communities.
          </p>
          <div className="rounded-xl bg-slate-700/50 p-6 text-left space-y-3">
            {[
              "Digital counseling sessions with expert advisors",
              "E-learning modules to develop new skills",
              "Build your digital portfolio",
              "Connect with employment opportunities",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#34a853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["🇳🇴 Norway", "🇬🇷 Greece", "🇹🇷 Turkey", "🇱🇻 Latvia", "🇪🇸 Spain", "🇮🇹 Italy"].map(
              (country) => (
                <span
                  key={country}
                  className="rounded-full bg-slate-700/50 px-3 py-1 text-xs text-slate-300"
                >
                  {country}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right panel - register form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a73e8]">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-wider text-[#1e293b]">RURAL-CONNECT</span>
          </div>
          <RegisterForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
