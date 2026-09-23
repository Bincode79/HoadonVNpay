import { useState } from "react";
import { Copy, Check, Landmark, X } from "lucide-react";
import { BANKS } from "@/data/banks";
import { BankLogo } from "@/components/BankLogo";

interface BankAccountsDialogProps {
  currentBankCode: string;
  currentAccountNumber: string;
  currentAccountName: string;
  onCopy: (text: string) => void;
}

const SAMPLE_ACCOUNTS = [
  { bankCode: "970436", accountNumber: "1234567890", accountName: "CONG TY ABC" },
  { bankCode: "970415", accountNumber: "0987654321", accountName: "CONG TY ABC" },
  { bankCode: "970422", accountNumber: "1122334455", accountName: "CONG TY ABC" },
  { bankCode: "970407", accountNumber: "5566778899", accountName: "CONG TY ABC" },
  { bankCode: "970423", accountNumber: "9988776655", accountName: "CONG TY ABC" },
];

export function BankAccountsDialog({
  currentBankCode,
  currentAccountNumber,
  currentAccountName,
  onCopy,
}: BankAccountsDialogProps) {
  const [open, setOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    onCopy(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const allAccounts = [
    {
      bankCode: currentBankCode,
      accountNumber: currentAccountNumber,
      accountName: currentAccountName,
      isCurrent: true,
    },
    ...SAMPLE_ACCOUNTS.filter((a) => a.accountNumber !== currentAccountNumber).slice(0, 9),
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="vv-btn-ghost-sm flex items-center gap-1.5"
      >
        <Landmark className="h-3.5 w-3.5" strokeWidth={1.75} />
        Danh sách tài khoản
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Danh sách tài khoản ngân hàng"
          onClick={() => setOpen(false)}
        >
          <div
            className="vv-box w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-[15px] font-medium text-foreground">Tài khoản ngân hàng</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-vnpay-text-sub transition-colors hover:bg-muted"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-2 overflow-y-auto p-3">
              {allAccounts.map((acc) => {
                const bank = BANKS.find((b) => b.code === acc.bankCode);
                const itemId = `${acc.bankCode}-${acc.accountNumber}`;
                return (
                  <div
                    key={itemId}
                    className={`rounded-md border p-3 ${
                      acc.isCurrent ? "border-primary bg-vnpay-sub" : "border-border"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      {bank && <BankLogo bank={bank} size="xs" />}
                      <span className="truncate text-[13px] font-medium text-foreground">
                        {bank?.name || acc.bankCode}
                      </span>
                      {acc.isCurrent && (
                        <span className="ml-auto shrink-0 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[11px] uppercase tracking-wide text-vnpay-text-sub">
                          {acc.accountName}
                        </p>
                        <p className="truncate text-[14px] text-foreground">{acc.accountNumber}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.accountNumber, itemId)}
                        className="shrink-0 rounded-md p-1.5 text-vnpay-text-sub transition-colors hover:bg-muted hover:text-primary"
                        aria-label="Sao chép số tài khoản"
                      >
                        {copiedId === itemId ? (
                          <Check className="h-4 w-4 text-vnpay-success" strokeWidth={2.5} />
                        ) : (
                          <Copy className="h-4 w-4" strokeWidth={1.75} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
