import { useEffect, useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { NapasMark, VietQrMark, VnpayWordmark } from "@/components/Brand";
import bannerLogo from "@/assets/vnpay-vietqr-banner.png";

/** Counts a transaction down from `seconds`, VNPay-style MM : SS. */
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((r) => (r <= 1 ? 0 : r - 1)), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return { remaining, label: `${mm} : ${ss}` };
}

interface TopBarProps {
  merchantName?: string;
  showTimer?: boolean;
}

/**
 * Single-row gateway top bar: brand on the left, timer + language on the
 * right. Deliberately short so the whole checkout fits one viewport.
 */
export function TopBar({ merchantName, showTimer = true }: TopBarProps) {
  const { label } = useCountdown(15 * 60);

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-4 py-2">
      <VnpayWordmark className="h-6" />

      <span className="hidden flex-col leading-none sm:flex">
        <span className="text-[11px] font-semibold text-foreground">Cổng thanh toán VNPAY</span>
        <span className="text-[10px] text-vnpay-text-light">Kênh thanh toán bảo mật</span>
      </span>

      {merchantName ? (
        <>
          <span className="hidden h-6 w-px bg-border md:block" />
          <img src={bannerLogo} alt={merchantName} className="hidden h-7 w-auto object-contain md:block" />
        </>
      ) : null}

      <span className="ml-auto flex items-center gap-3">
        {showTimer ? (
          <span className="flex items-center gap-1.5">
            <span className="hidden text-[12px] text-vnpay-text-sub sm:inline">Hết hạn sau</span>
            <span className="vv-timer text-[14px] font-semibold text-destructive">{label}</span>
          </span>
        ) : null}
        <span className="flex items-center gap-1 text-[12px] text-vnpay-text-sub">
          <span className="font-semibold text-foreground">VI</span>
          <span className="text-vnpay-text-light">/</span>
          <span className="text-vnpay-text-light">EN</span>
          <ChevronDown className="h-3 w-3 text-vnpay-text-light" />
        </span>
      </span>
    </header>
  );
}

/**
 * Brand strip. Sits directly beneath the two panels so the payment channel is
 * identifiable right where the document content ends.
 */
export function BrandStrip({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 ${className ?? ""}`}
      data-brand-strip
      aria-label="Thanh toán qua cổng VNPAY, chuẩn VietQR và NAPAS 247"
    >
      <span className="flex items-center gap-1.5">
        <VnpayWordmark className="h-4" />
        <span className="text-[11px] text-vnpay-text-sub">Cổng thanh toán VNPAY</span>
      </span>
      <span className="h-4 w-px bg-border" aria-hidden />
      <span className="flex items-center gap-1.5">
        <VietQrMark className="h-4" />
        <NapasMark className="h-3" />
        <span className="text-[11px] text-vnpay-text-sub">Chuẩn VietQR / NAPAS 247</span>
      </span>
    </div>
  );
}

/**
 * Footer bar. Carries the document actions and trust marks; the brand lockups
 * themselves live in BrandStrip, directly under the panels.
 */
export function StatusBar({ actions }: { actions?: React.ReactNode }) {
  return (
    <footer className="no-print flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-t border-border bg-card px-4 py-1.5">
      <span className="flex items-center gap-1.5 text-[11px] text-vnpay-success">
        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
        PCI-DSS · GlobalSign
      </span>
      <span className="hidden text-[11px] text-vnpay-text-light sm:inline">·</span>
      <span className="text-[11px] text-vnpay-text-sub">
        Phát triển bởi <span className="font-semibold text-foreground">VNPAY</span> © 2026
      </span>
      <span className="hidden text-[11px] text-vnpay-text-light lg:inline">·</span>
      <span className="hidden text-[11px] text-vnpay-text-light lg:inline">hotrovnpay@vnpay.vn</span>

      {actions ? <span className="ml-auto hidden items-center gap-2 sm:flex">{actions}</span> : null}
    </footer>
  );
}
