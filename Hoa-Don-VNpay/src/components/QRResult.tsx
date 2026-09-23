import { Check, Copy, QrCode, AlertTriangle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { BANKS } from "@/data/banks";
import { displayAmount, buildOrderRef, formatIssuedAt } from "@/lib/string-utils";
import { BankAccountsDialog } from "@/components/BankAccountsDialog";
import { BankLogo } from "@/components/BankLogo";
import { GatewayLockup, QrBrandBadge, VnpayWordmark } from "@/components/Brand";

interface QRResultProps {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: string;
  message: string;
  qrValue: string;
  qrData: string;
  useLocalQR: boolean;
  isLoading: boolean;
  onCopy: (text: string) => void;
}

const SUPPORTED_UNITS = ["970436", "970405", "970418", "970415", "970422", "970407"];

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="shrink-0 text-[12px] text-vnpay-text-sub">{label}</dt>
      <dd
        className={`min-w-0 truncate text-right text-[12px] font-medium text-foreground ${
          mono ? "font-mono tracking-tight" : ""
        }`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

export function QRResult({
  bankCode,
  accountNumber,
  accountName,
  amount,
  message,
  qrValue,
  qrData,
  useLocalQR,
  isLoading,
  onCopy,
}: QRResultProps) {
  const selectedBank = BANKS.find((b) => b.code === bankCode);
  const qrImageValue = useLocalQR ? qrValue : qrData || qrValue;
  const orderRef = buildOrderRef(bankCode, accountNumber, amount);
  const issuedAt = formatIssuedAt(new Date());

  return (
    <div className="w-full">
      <div className="mx-auto grid w-full max-w-[960px] items-stretch gap-4 lg:grid-cols-[390px_minmax(0,1fr)]">
      {/* === Left: QR === */}
      <aside className="vv-sheet flex flex-col overflow-hidden">
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2.5">
          <QrCode className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <h2 className="text-[14px] font-medium text-foreground">Quét mã thanh toán</h2>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-vnpay-success">
            <Check className="h-3.5 w-3.5" strokeWidth={3} /> Đã tạo mã
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-4">
          <p className="text-[12px] text-vnpay-text-sub">
            Số tiền:{" "}
            <span className="font-semibold text-primary">
              {amount ? `${displayAmount(amount)} VND` : "người quét tự nhập"}
            </span>
          </p>

          <div className="vv-qr-frame relative rounded-md border border-border bg-white p-3 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            <QRCodeSVG
              value={qrImageValue}
              size={180}
              level="H"
              fgColor="#21262c"
              bgColor="#ffffff"
              includeMargin={false}
              className="vv-qr"
            />
            <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded border border-border bg-white">
              <QrBrandBadge />
            </span>
          </div>

          <p className="max-w-[280px] text-center text-[11px] leading-snug text-vnpay-text-sub">
            Dùng <span className="font-medium text-foreground">ứng dụng ngân hàng</span> hoặc{" "}
            <span className="font-medium text-foreground">Ví VNPAY</span> để quét. Không đóng trình duyệt
            khi giao dịch.
          </p>

          {isLoading && <p className="text-[11px] text-vnpay-text-sub">Đang đồng bộ mã QR…</p>}

          <div className="flex items-center justify-center gap-2">
            <VnpayWordmark className="h-4" />
            <span className="text-[11px] text-vnpay-text-sub">Cổng thanh toán VNPAY</span>
          </div>
        </div>
      </aside>

      {/* === Right: details + actions === */}
      <article className="vv-sheet flex min-h-0 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-2.5">
          <h2 className="text-[14px] font-medium text-foreground">Thông tin giao dịch</h2>
          <span className="ml-auto font-mono text-[11px] text-vnpay-text-sub">{orderRef}</span>
        </div>

        <div className="vv-scroll flex min-h-0 flex-1 flex-col gap-3 p-4">
          <div className="rounded-md border border-border bg-muted/50 px-3 py-2">
            <GatewayLockup />
          </div>

          <dl className="divide-y divide-border">
            <Row label="Ngân hàng" value={selectedBank ? selectedBank.fullName : "—"} />
            <Row label="Số tài khoản" value={accountNumber || "—"} />
            <Row label="Chủ tài khoản" value={accountName || "—"} />
            <Row label="Số tiền" value={amount ? `${displayAmount(amount)} VND` : "Người quét tự nhập"} />
            <Row label="Nội dung" value={message || "Người quét tự nhập"} />
            <Row label="Phí giao dịch" value="Miễn phí" />
            <Row label="Mã giao dịch" value={orderRef} mono />
            <Row label="Thời điểm tạo" value={issuedAt} />
          </dl>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onCopy(accountNumber)}
              className="vv-btn-ghost-sm flex items-center gap-1.5"
            >
              <Copy className="h-3.5 w-3.5" strokeWidth={1.75} /> Sao chép số tài khoản
            </button>
            <BankAccountsDialog
              currentBankCode={bankCode}
              currentAccountNumber={accountNumber}
              currentAccountName={accountName}
              onCopy={onCopy}
            />
          </div>

          <div className="rounded-md border border-border p-2.5">
            <p className="mb-2 text-[11px] text-vnpay-text-sub">Đơn vị hỗ trợ thanh toán</p>
            <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
              {SUPPORTED_UNITS.map((code) => {
                const bank = BANKS.find((b) => b.code === code);
                if (!bank) return null;
                return (
                  <li
                    key={code}
                    className="flex h-[40px] items-center justify-center rounded border border-border bg-white p-1"
                    title={bank.fullName}
                  >
                    <BankLogo bank={bank} size="xs" />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-start gap-2 rounded-md border border-vnpay-warning/35 bg-vnpay-warning/8 px-3 py-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-vnpay-warning" strokeWidth={1.75} />
            <p className="text-[11px] leading-snug text-vnpay-text-sub">
              Kiểm tra kỹ tên chủ tài khoản trước khi xác nhận. Nếu sai lệch, dừng giao dịch và liên hệ
              hỗ trợ.
            </p>
          </div>
        </div>
      </article>
      </div>
    </div>
  );
}
