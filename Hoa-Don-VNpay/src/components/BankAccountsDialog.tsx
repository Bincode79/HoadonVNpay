import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { BANKS } from "@/data/banks";

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
    { bankCode: currentBankCode, accountNumber: currentAccountNumber, accountName: currentAccountName, isCurrent: true },
    ...SAMPLE_ACCOUNTS
      .filter((a) => a.accountNumber !== currentAccountNumber)
      .slice(0, 9)
      .map((a) => ({ ...a, isCurrent: false })),
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1"
      >
        <span className="text-[10px] sm:text-xs text-[#0066FF] dark:text-blue-400 cursor-pointer hover:underline">Xem tài khoản 9 ngân hàng khác</span>
        <span className="text-[9px] text-[#5A6A7A] dark:text-gray-400">(Click để xem)</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6EEF7] dark:border-gray-700">
              <h3 className="text-sm font-semibold text-[#1a3a6b] dark:text-blue-300">TÀI KHOẢN NGÂN HÀNG</h3>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-[#F5F6FA] dark:hover:bg-gray-700 rounded" aria-label="Đóng">
                <X className="w-4 h-4 text-[#5A6A7A] dark:text-gray-400" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3">
              {allAccounts.map((acc) => {
                const bank = BANKS.find((b) => b.code === acc.bankCode);
                const itemId = `${acc.bankCode}-${acc.accountNumber}`;
                return (
                  <div
                    key={itemId}
                    className={`rounded-xl border p-3 ${
                      acc.isCurrent
                        ? "border-[#1a3a6b] dark:border-blue-500 bg-[#F0F5FF] dark:bg-blue-900/30"
                        : "border-[#DCE6F2] dark:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {bank?.logo && (
                        <img src={bank.logo} alt="" className="w-5 h-5 object-contain" />
                      )}
                      <span className="text-xs font-semibold text-[#2D3A4A] dark:text-gray-100">{bank?.name || acc.bankCode}</span>
                      {acc.isCurrent && (
                        <span className="text-[8px] bg-[#1a3a6b] dark:bg-blue-600 text-white px-1.5 py-0.5 rounded">Mặc định</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[#2D3A4A] dark:text-gray-100">{acc.accountName}</p>
                        <p className="text-xs font-mono text-[#2D3A4A] dark:text-gray-100">{acc.accountNumber}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(acc.accountNumber, itemId)}
                        className="p-1.5 rounded-lg hover:bg-[#E6EEF7] dark:hover:bg-gray-700 transition-colors"
                        aria-label="Sao chép số tài khoản"
                      >
                        {copiedId === itemId ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-[#5A6A7A] dark:text-gray-400" />
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