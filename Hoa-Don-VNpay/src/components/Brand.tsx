import vnpayLogo from "@/assets/brand/vnpay.png";
import vietqrLogo from "@/assets/brand/vietqr.png";
import napasLogo from "@/assets/brand/napas.png";
import vnpayMark from "@/assets/brand/vnpay-mark.png";
import { cn } from "@/lib/utils";

/**
 * Every brand asset is normalised so the visible mark is 96px tall inside a
 * 128px canvas (see src/assets/brand). Rendering them at one shared height
 * therefore gives equal optical weight, whatever each wordmark's aspect is.
 */
type BrandSize = "sm" | "md" | "lg";

const LOGO_H: Record<BrandSize, string> = {
  sm: "h-4",
  md: "h-5",
  lg: "h-7",
};

const LABEL: Record<BrandSize, string> = {
  sm: "text-[10px]",
  md: "text-[11px]",
  lg: "text-[13px]",
};

interface BrandLockupProps {
  size?: BrandSize;
  className?: string;
}

/**
 * Full channel identification: who processes the payment, and which standard
 * the QR follows. Two labelled groups behind one rule, so the marks read as a
 * single signature rather than scattered images.
 */
export function GatewayLockup({ size = "md", className }: BrandLockupProps) {
  const h = LOGO_H[size];
  const label = LABEL[size];

  return (
    <div
      className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2", className)}
      aria-label="Thanh toán qua cổng VNPAY, chuẩn VietQR và NAPAS 247"
    >
      <span className="flex items-center gap-2">
        <img src={vnpayLogo} alt="VNPAY" className={cn("w-auto object-contain", h)} />
        <span className={cn("font-medium leading-tight text-vnpay-text-sub", label)}>
          Cổng thanh toán <span className="font-semibold text-foreground">VNPAY</span>
        </span>
      </span>

      <span className="h-5 w-px shrink-0 bg-border" aria-hidden />

      <span className="flex items-center gap-2">
        <img src={vietqrLogo} alt="VietQR" className={cn("w-auto object-contain", h)} />
        <img src={napasLogo} alt="NAPAS 247" className={cn("w-auto object-contain", h)} />
        <span className={cn("font-medium leading-tight text-vnpay-text-sub", label)}>
          Chuẩn <span className="font-semibold text-foreground">VietQR / NAPAS 247</span>
        </span>
      </span>
    </div>
  );
}

/** Full VNPAY wordmark, for inline identification next to copy. */
export function VnpayWordmark({ className }: { className?: string }) {
  return <img src={vnpayLogo} alt="VNPAY" className={cn("w-auto object-contain", className)} />;
}

/**
 * The square VNPAY "V" mark, sized for the QR centre badge. The wordmark is far
 * too wide to sit inside a square code without shrinking to illegibility.
 */
export function QrBrandBadge({ className }: { className?: string }) {
  return <img src={vnpayMark} alt="VNPAY" className={cn("h-full w-full object-contain p-0.5", className)} />;
}

export function VietQrMark({ className }: { className?: string }) {
  return <img src={vietqrLogo} alt="VietQR" className={cn("w-auto object-contain", className)} />;
}

export function NapasMark({ className }: { className?: string }) {
  return <img src={napasLogo} alt="NAPAS 247" className={cn("w-auto object-contain", className)} />;
}
