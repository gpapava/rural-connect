import { cn } from "@/lib/utils";

const DISCLAIMER =
  "Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them. Project Number: 2024-1-TR01-KA220-ADU-000245111";

/**
 * Erasmus+ / Turkish National Agency co-funding notice (required on every page).
 * - "panel": large, on the dark login/registration side panel (sits on a white card).
 * - "footer": compact, at the bottom of the page content.
 */
export default function FundingBanner({
  variant = "footer",
  className,
}: {
  variant?: "panel" | "footer";
  className?: string;
}) {
  if (variant === "panel") {
    return (
      <div className={cn("w-full max-w-xl self-start rounded-xl bg-white p-4 shadow-lg", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/funding-banner.png"
          alt="Co-funded by the Erasmus+ Programme of the European Union — Türkiye Ulusal Ajansı (Turkish National Agency)"
          className="h-auto w-full"
        />
        <p className="mt-3 text-[11px] leading-snug text-gray-500">{DISCLAIMER}</p>
      </div>
    );
  }
  return (
    <footer className={cn("border-t border-gray-200 pt-4", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/funding-banner.png"
        alt="Co-funded by the Erasmus+ Programme of the European Union — Türkiye Ulusal Ajansı (Turkish National Agency)"
        className="h-auto w-full max-w-[420px] mix-blend-multiply"
      />
      <p className="mt-2 max-w-3xl text-[11px] leading-snug text-gray-500">{DISCLAIMER}</p>
    </footer>
  );
}
