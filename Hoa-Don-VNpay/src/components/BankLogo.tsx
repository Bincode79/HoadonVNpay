import { BANKS, type Bank } from "@/data/banks";
import { cn } from "@/lib/utils";

/**
 * Bank logos are all pre-normalised to an identical 320x120 canvas with the
 * artwork trimmed and centred (see the asset pipeline). Rendering that canvas
 * with object-contain therefore gives every bank the same optical footprint,
 * whatever the original aspect ratio was.
 */
type LogoSize = "xs" | "sm" | "md" | "lg";

const BOX: Record<LogoSize, string> = {
  xs: "h-5 w-[52px]",
  sm: "h-8 w-[84px]",
  md: "h-11 w-[116px]",
  lg: "h-14 w-[148px]",
};

interface BankLogoProps {
  bank?: Bank | string;
  size?: LogoSize;
  className?: string;
}

export function BankLogo({ bank, size = "sm", className }: BankLogoProps) {
  const resolved = typeof bank === "string" ? BANKS.find((b) => b.code === bank) : bank;
  if (!resolved?.logo) return null;

  return (
    <span className={cn("flex shrink-0 items-center justify-center", BOX[size], className)}>
      <img
        src={resolved.logo}
        alt={resolved.name}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </span>
  );
}
