import { cn } from "@/lib/utils";

/** The RURAL-CONNECT project logo on a white tile, so it stays readable on dark and coloured backgrounds. */
export default function BrandMark({
  className = "h-9 w-9",
  rounded = "rounded-xl",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <span className={cn("flex flex-shrink-0 items-center justify-center bg-white p-0.5 shadow-sm", rounded, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/rural-connect-logo.png" alt="RURAL-CONNECT" className="h-full w-full object-contain" />
    </span>
  );
}
