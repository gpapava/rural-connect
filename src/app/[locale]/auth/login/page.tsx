import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

interface LoginPageProps {
  params: { locale: string };
}

export default async function LoginPage({ params: { locale } }: LoginPageProps) {
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
            <span className="text-2xl font-bold tracking-wider">
              RURAL-CONNECT
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight">
            Empowering Rural Youth
          </h2>
          <p className="mb-8 text-slate-300 leading-relaxed">
            Supporting NEET young people in rural communities across Europe
            through digital counseling, skills development, and employment
            pathways.
          </p>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="rounded-xl bg-slate-700/50 p-4">
              <div className="text-2xl font-bold text-[#1a73e8]">7</div>
              <div className="mt-1 text-xs text-slate-400">Countries</div>
            </div>
            <div className="rounded-xl bg-slate-700/50 p-4">
              <div className="text-2xl font-bold text-[#34a853]">500+</div>
              <div className="mt-1 text-xs text-slate-400">Users Helped</div>
            </div>
            <div className="rounded-xl bg-slate-700/50 p-4">
              <div className="text-2xl font-bold text-[#fbbc04]">24/7</div>
              <div className="mt-1 text-xs text-slate-400">Support</div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
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

      {/* Right panel - login form */}
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
            <span className="text-xl font-bold tracking-wider text-[#1e293b]">
              RURAL-CONNECT
            </span>
          </div>
          <LoginForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
