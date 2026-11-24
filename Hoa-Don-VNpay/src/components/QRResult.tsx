import { useState } from "react";
import {
  Check,
  Copy,
  CreditCard,
  Download,
  Landmark,
  RotateCcw,
  Shield,
  Smartphone,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { BANKS } from "@/data/banks";
import { PAYMENT_METHODS } from "@/data/payment-methods";
import { displayAmount } from "@/lib/string-utils";
import { BankAccountsDialog } from "@/components/BankAccountsDialog";
import caavLogo from "@/assets/caav-logo.svg";
import bannerLogo from "@/assets/vnpay-vietqr-banner.png";

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
  logoSize: number;
  qrSize: number;
  onCopy: (text: string) => void;
  onReset: () => void;
}

const METHOD_ICONS = {
  atm: CreditCard,
  "atm-vnpay": Smartphone,
  "credit-onepay": CreditCard,
  "credit-vnpay": CreditCard,
  transfer: Landmark,
} as const;

function CopyButton({
  value,
  label,
  onCopy,
}: {
  value: string;
  label: string;
  onCopy: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const handleCopy = () => {
    onCopy(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Sao chép ${label}`}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#DCE6F2] bg-white text-[#5A6A7A] transition-colors hover:border-[#005BAC] hover:text-[#005BAC] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function DetailRow({
  label,
  value,
  copyValue,
  mono = false,
  strong = false,
  onCopy,
}: {
  label: string;
  value: string;
  copyValue?: string;
  mono?: boolean;
  strong?: boolean;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E6EEF7] bg-white px-2.5 py-2 dark:border-gray-700 dark:bg-gray-800">
      <div className="min-w-0">
        <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7A8A9A] dark:text-gray-400">
          {label}
        </dt>
        <dd className={`mt-0.5 truncate text-xs text-[#2D3A4A] dark:text-gray-100 ${mono ? "font-mono" : "font-medium"} ${strong ? "text-sm font-bold text-[#005BAC] dark:text-blue-300" : ""}`}>
          {value}
        </dd>
      </div>
      <CopyButton value={copyValue || ""} label={label.toLowerCase()} onCopy={onCopy} />
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
  qrSize,
  onCopy,
  onReset,
}: QRResultProps) {
  const [selectedMethod, setSelectedMethod] = useState("transfer");
  const selectedBank = BANKS.find((b) => b.code === bankCode);
  const selectedPaymentMethod =
    PAYMENT_METHODS.find((method) => method.id === selectedMethod) ?? PAYMENT_METHODS[PAYMENT_METHODS.length - 1];
  const qrCodeSize = Math.min(Math.max(qrSize || 88, 72), 96);

  return (
    <div className="flex min-h-dvh flex-col items-center bg-gradient-to-b from-[#E8EDF4] to-[#F5F6FA] px-3 py-3 dark:from-gray-900 dark:to-gray-900 sm:px-4 sm:py-4">
      <div className="w-full max-w-xl">
        <div
          aria-busy={isLoading}
          className="overflow-hidden rounded-[24px] border border-[#DCE6F2] bg-white shadow-[0_22px_50px_-28px_rgba(15,35,65,0.35)] dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-[#002855] via-[#005480] to-[#002855] px-4 py-4 text-center sm:px-6">
            <div className="absolute inset-0 bg-[url('/qr-frame.png')] opacity-5" />
            <div className="relative flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm">
                  <img src={caavLogo} alt="CAAV" className="h-8 w-8 object-contain" />
                </div>
                <div className="text-left">
                  <h1 className="text-lg font-bold tracking-wide text-white sm:text-xl">
                    CỔNG THANH TOÁN TRỰC TUYẾN
                  </h1>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#FFD700] sm:text-sm">
                    Trung tâm Hàng không Việt Nam
                  </p>
                </div>
              </div>
              <img
                src={bannerLogo}
                alt="VNPAY × VietQR"
                className="mt-1 h-9 w-auto max-w-[280px] object-contain sm:h-10"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500]" />
          </div>

          <div className="px-3 py-4 sm:px-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#2D3A4A] dark:text-gray-100">
                  Chọn phương thức thanh toán
                </h2>
                <p className="text-[11px] text-[#7A8A9A] dark:text-gray-400">
                  Phí được tính theo phương thức bạn lựa chọn
                </p>
              </div>
              <span className="rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#005BAC] dark:bg-blue-900/40 dark:text-blue-300">
                VietQR
              </span>
            </div>

            <div role="radiogroup" aria-label="Phương thức thanh toán" className="grid gap-2 sm:grid-cols-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id;
                const Icon = METHOD_ICONS[method.id as keyof typeof METHOD_ICONS] ?? CreditCard;

                return (
                  <button
                    key={method.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={!method.available}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "border-[#005BAC] bg-[#F0F6FF] shadow-[inset_0_0_0_1px_rgba(0,91,172,0.08)] dark:border-blue-400 dark:bg-blue-900/20"
                        : "border-[#DCE6F2] bg-white hover:border-[#9BB8D8] dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500"
                    } ${method.available ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        isSelected
                          ? "bg-[#005BAC] text-white dark:bg-blue-500"
                          : "border-2 border-[#CBD5E1] bg-white dark:border-gray-500 dark:bg-gray-700"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FB] text-[#005BAC] dark:bg-blue-900/30 dark:text-blue-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-[#2D3A4A] dark:text-gray-100">
                        {method.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-[#7A8A9A] dark:text-gray-400">
                        {method.note}
                      </span>
                    </span>
                    {!method.available && (
                      <span className="mt-0.5 shrink-0 rounded-full bg-[#FFF4D6] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#8D6E00] dark:bg-yellow-900/30 dark:text-yellow-300">
                        Sắp hỗ trợ
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedPaymentMethod.id === "transfer" ? (
            <div className="border-t border-[#E5E7EB] dark:border-gray-700">
              <div className="border-b border-[#E5E7EB] px-3 py-3 dark:border-gray-700 sm:px-4">
                <div className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#005BAC] dark:text-blue-300" />
                  <p className="text-xs leading-relaxed text-[#5A6A7A] dark:text-gray-400">
                    Sau khi nhận được thông tin đặt dịch vụ, nhân viên chăm sóc khách hàng sẽ liên hệ để xác nhận và hướng dẫn thủ tục thanh toán.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 p-3 sm:p-4 md:grid-cols-[minmax(0,1fr)_160px]">
                <div className="min-w-0 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl border border-[#E6EEF7] bg-[#F8FAFC] p-3 dark:border-gray-700 dark:bg-gray-900/40">
                    {selectedBank?.logo && (
                      <img
                        src={selectedBank.logo}
                        alt={selectedBank.name}
                        className="h-11 w-11 shrink-0 rounded-lg bg-white object-contain p-1 dark:bg-gray-700"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7A8A9A] dark:text-gray-400">
                        Ngân hàng thụ hưởng
                      </p>
                      <p className="truncate text-sm font-semibold text-[#2D3A4A] dark:text-gray-100">
                        {selectedBank?.fullName || "—"}
                      </p>
                      <p className="text-xs text-[#7A8A9A] dark:text-gray-400">
                        Mã ngân hàng: <span className="font-mono">{bankCode || "—"}</span>
                      </p>
                    </div>
                  </div>

                  <dl className="grid gap-2 sm:grid-cols-2">
                    <DetailRow label="Tên tài khoản" value={accountName || "—"} copyValue={accountName} onCopy={onCopy} />
                    <DetailRow label="Số tài khoản" value={accountNumber || "—"} copyValue={accountNumber} mono onCopy={onCopy} />
                    <DetailRow
                      label="Số tiền"
                      value={amount ? `${displayAmount(amount)} VNĐ` : "— VNĐ"}
                      copyValue={amount}
                      strong
                      onCopy={onCopy}
                    />
                    <DetailRow label="Nội dung" value={message || "—"} copyValue={message} onCopy={onCopy} />
                  </dl>

                  <BankAccountsDialog
                    currentBankCode={bankCode}
                    currentAccountNumber={accountNumber}
                    currentAccountName={accountName}
                    onCopy={onCopy}
                  />
                </div>

                <div className="flex flex-col items-center justify-center rounded-xl border border-[#E6EEF7] bg-[#F8FAFC] p-3 dark:border-gray-700 dark:bg-gray-900/40">
                  <div className="relative w-32">
                    <img src="/qr-frame.png" alt="QR Frame" className="h-auto w-full object-contain" />
                    <div className="absolute left-[9%] right-[9%] top-[20%] flex items-center justify-center">
                      <QRCodeSVG
                        value={useLocalQR ? qrValue : qrData || qrValue}
                        size={qrCodeSize}
                        level="H"
                        fgColor="#000000"
                        bgColor="#ffffff"
                        className="object-contain"
                        includeMargin={false}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-center text-[11px] font-medium text-[#2D3A4A] dark:text-gray-200">
                    Quét mã QR để thanh toán
                  </p>
                  <p className="text-center text-[10px] leading-relaxed text-[#7A8A9A] dark:text-gray-400">
                    Dùng ứng dụng ngân hàng hoặc VNPAY/VietQR
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t border-[#E5E7EB] px-4 py-8 text-center dark:border-gray-700">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FB] text-[#005BAC] dark:bg-blue-900/30 dark:text-blue-300">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#2D3A4A] dark:text-gray-100">
                {selectedPaymentMethod.label}
              </h3>
              <p className="mt-1 text-xs text-[#7A8A9A] dark:text-gray-400">
                {selectedPaymentMethod.note}. Phương thức này chưa khả dụng trong phiên bản VietQR hiện tại.
              </p>
              <button
                type="button"
                onClick={() => setSelectedMethod("transfer")}
                className="mt-4 rounded-lg bg-[#005BAC] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#00468f] dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Chọn chuyển khoản ngân hàng
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 dark:border-gray-700 dark:bg-gray-900/40 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#7A8A9A] dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#005BAC] dark:text-blue-300" />
                Bảo mật SSL 256-bit
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Mã QR có hiệu lực trong 24h
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#003366] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#004080] dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Download className="h-3.5 w-3.5" />
                In / Lưu PDF
              </button>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#003366]/30 px-3 py-2 text-xs font-semibold text-[#003366] transition-colors hover:bg-[#003366]/5 dark:border-blue-400/40 dark:text-blue-300 dark:hover:bg-blue-900/30"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Tạo mới
              </button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.14em] text-[#7A8A9A] dark:text-gray-500">
          Trung tâm Hàng không Việt Nam - Civil Aviation Authority of Vietnam
        </p>
      </div>
    </div>
  );
}
