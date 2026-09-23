import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Landmark, Loader2, QrCode, Info, Check } from "lucide-react";
import { BANKS } from "@/data/banks";
import { toUpperCaseNoAccent, formatAmount, displayAmount } from "@/lib/string-utils";
import { BankLogo } from "@/components/BankLogo";
import { GatewayLockup, QrBrandBadge } from "@/components/Brand";

const MIN_ACCOUNT_LENGTH = 1;
const MAX_ACCOUNT_LENGTH = 16;
const QUICK_BANKS = ["970436", "970415", "970418", "970422", "970407", "970432"];

interface QRFormProps {
  bankCode: string;
  setBankCode: (v: string) => void;
  accountNumber: string;
  setAccountNumber: (v: string) => void;
  accountName: string;
  setAccountName: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
  qrValue: string;
}

export function QRForm({
  bankCode, setBankCode,
  accountNumber, setAccountNumber,
  accountName, setAccountName,
  amount, setAmount,
  message, setMessage,
  isLoading, onGenerate,
  qrValue,
}: QRFormProps) {
  const selectedBank = useMemo(() => BANKS.find((b) => b.code === bankCode), [bankCode]);

  const accValid = accountNumber.length >= MIN_ACCOUNT_LENGTH && accountNumber.length <= MAX_ACCOUNT_LENGTH;
  const canGenerate = !!bankCode && accValid && !isLoading && !!accountNumber;
  const ready = !!bankCode && !!accountNumber;

  return (
    <div className="w-full">
      <div className="mx-auto grid w-full max-w-[960px] items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_390px]">
      {/* === Left: transfer details === */}
      <article className="vv-sheet flex flex-col overflow-hidden">
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-2.5">
          <Landmark className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <h2 className="text-[14px] font-medium text-foreground">Thông tin chuyển khoản</h2>
          <span className="ml-auto rounded-full bg-vnpay-sub px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            Miễn phí giao dịch
          </span>
        </div>

        <div className="vv-scroll flex min-h-0 flex-1 flex-col gap-3 p-4">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="bank" className="text-[12px] font-medium text-vnpay-text-sub">
                  Ngân hàng thụ hưởng
                </Label>
                <Select value={bankCode} onValueChange={setBankCode}>
                  <SelectTrigger id="bank" className="vv-input-sm w-full justify-between px-3 text-left">
                    <SelectValue placeholder="Chọn ngân hàng" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {BANKS.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        <span className="flex items-center gap-2.5">
                          <BankLogo bank={bank} size="xs" />
                          <span className="text-[13px]">{bank.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="accountNumber" className="text-[12px] font-medium text-vnpay-text-sub">
                  Số tài khoản
                </Label>
                <Input
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="Nhập số tài khoản"
                  className={`vv-input-sm w-full ${!accValid && accountNumber.length > 0 ? "is-invalid" : ""}`}
                  maxLength={MAX_ACCOUNT_LENGTH}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="accountName" className="text-[12px] font-medium text-vnpay-text-sub">
                Tên chủ tài khoản
              </Label>
              <Input
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(toUpperCaseNoAccent(e.target.value))}
                placeholder="NGUYEN VAN A"
                className="vv-input-sm w-full uppercase"
              />
            </div>

            <div>
              <p className="mb-1.5 text-[11px] text-vnpay-text-light">Ngân hàng phổ biến</p>
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                {QUICK_BANKS.map((code) => {
                  const bank = BANKS.find((b) => b.code === code);
                  if (!bank) return null;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setBankCode(code)}
                      title={bank.fullName}
                      className={`vv-bank-tile flex h-[46px] items-center justify-center p-1 ${
                        bankCode === code ? "is-active" : ""
                      }`}
                    >
                      <BankLogo bank={bank} size="xs" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-[12px] font-medium text-vnpay-text-sub">
                  Số tiền <span className="text-vnpay-text-light">(tùy chọn)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(formatAmount(e.target.value))}
                    placeholder="0"
                    className="vv-input-sm w-full pr-8 text-right"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-vnpay-text-sub">
                    ₫
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-[12px] font-medium text-vnpay-text-sub">
                  Nội dung <span className="text-vnpay-text-light">(tùy chọn)</span>
                </Label>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Thanh toan don hang 001"
                  className="vv-input-sm w-full"
                  maxLength={50}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="rounded-md border border-border bg-muted/50 px-3 py-2">
              <GatewayLockup />
            </div>
            <div className="flex items-start gap-2 rounded-md bg-muted px-3 py-2">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
              <p className="text-[11px] leading-snug text-vnpay-text-sub">
                Thanh toán được xử lý qua <span className="font-medium text-foreground">cổng VNPAY</span>,
                mã QR theo chuẩn <span className="font-medium text-foreground">VietQR / NAPAS 247</span>.
                Người quét tự nhập số tiền và nội dung.
              </p>
            </div>
            <Button onClick={onGenerate} disabled={!canGenerate} className="vv-btn-primary w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo mã QR…
                </>
              ) : (
                "Tạo mã QR thanh toán"
              )}
            </Button>
          </div>
        </div>
      </article>

      {/* === Right: live QR === */}
      <aside className="vv-sheet flex min-h-0 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2.5">
          <QrCode className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <h2 className="text-[14px] font-medium text-foreground">Mã QR thanh toán</h2>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-4">
          <div className="vv-qr-frame relative rounded-md border border-border bg-white p-3 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            {ready ? (
              <>
                <QRCodeSVG
                  value={qrValue}
                  size={188}
                  level="H"
                  fgColor="#21262c"
                  bgColor="#ffffff"
                  includeMargin={false}
                  className="vv-qr"
                />
                <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded border border-border bg-white">
                  <QrBrandBadge />
                </span>
              </>
            ) : (
              <div className="vv-qr flex flex-col items-center justify-center gap-2 px-4 text-center">
                <QrCode className="h-9 w-9 text-vnpay-text-light" strokeWidth={1.25} />
                <p className="text-[11px] leading-snug text-vnpay-text-sub">
                  Mã QR hiện sau khi chọn ngân hàng và nhập số tài khoản
                </p>
              </div>
            )}
          </div>

          <dl className="w-full space-y-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[11px] text-vnpay-text-sub">Ngân hàng</dt>
              <dd className="truncate text-right text-[12px] font-medium text-foreground">
                {selectedBank?.name ?? "—"}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[11px] text-vnpay-text-sub">Số tài khoản</dt>
              <dd className="truncate text-right text-[12px] text-foreground">{accountNumber || "—"}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[11px] text-vnpay-text-sub">Số tiền</dt>
              <dd className="truncate text-right text-[12px] font-semibold text-foreground">
                {amount ? `${displayAmount(amount)} ₫` : "Để trống"}
              </dd>
            </div>
          </dl>

          <p className="flex items-center gap-1.5 text-[11px] text-vnpay-success">
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> Sẵn sàng tạo mã
          </p>
        </div>
      </aside>
      </div>
    </div>
  );
}
