import { useState } from "react";
import { Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { BANKS } from "@/data/banks";
import { PAYMENT_METHODS } from "@/data/payment-methods";
import { displayAmount } from "@/lib/string-utils";
import { BankAccountsDialog } from "@/components/BankAccountsDialog";
import vnpayLogo from "@/assets/vnpay-logo-hd.png";
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
  logoSize,
  qrSize,
  onCopy,
  onReset,
}: QRResultProps) {
  const [selectedMethod, setSelectedMethod] = useState("transfer");
  const selectedBank = BANKS.find((b) => b.code === bankCode);

  return (
    <div className="min-h-[120vh] flex flex-col bg-gradient-to-b from-[#E8EDF4] to-[#F5F6FA] dark:from-gray-900 dark:to-gray-900 items-center justify-center py-2 sm:py-4 px-3 sm:px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-[28px] border border-[#E5E7EB] dark:border-gray-700 overflow-hidden shadow-[0_22px_50px_-28px_rgba(15,35,65,0.35)] min-h-[120vh] pt-6">
          <div className="pt-3 pb-2 px-4 text-center">
            <div className="flex flex-col items-center justify-center gap-0.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-[#005BAC] dark:text-blue-300">CỔNG THANH TOÁN TRỰC TUYẾN</h1>
              <img src={bannerLogo} alt="VNPAY × VietQR" className="object-contain w-full max-w-[400px] h-[90px]" />
            </div>
          </div>
          <div className="p-1 sm:p-1.5">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`mb-1.5 sm:mb-2 border ${selectedMethod === method.id ? "border-[#005BAC] dark:border-blue-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-800 cursor-pointer`}>
                <div className="p-1.5 sm:p-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${selectedMethod === method.id ? "bg-[#005BAC] dark:bg-blue-600" : "bg-white dark:bg-gray-700 border-2 border-[#D1D9E6] dark:border-gray-500"}`}>
                      {selectedMethod === method.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-semibold text-[#2D3A4A] dark:text-gray-100">{method.label}</span>
                    <span className="text-xs italic text-[#5A6A7A] dark:text-gray-400">({method.note})</span>
                  </div>
                </div>

                {selectedMethod === method.id && (
                  <div className="border-t border-[#E5E7EB] dark:border-gray-700">
                    <p className="text-xs leading-relaxed text-[#5A6A7A] dark:text-gray-400 px-2 pt-1.5 italic">
                      Sau khi nhận được thông tin đặt dịch vụ, nhân viên chăm sóc khách hàng của chúng tôi sẽ liên hệ với Quý khách để xác nhận và hướng dẫn thêm về thủ tục thanh toán.
                    </p>
                    <div className="flex flex-col lg:flex-row items-stretch">
                      <div className="lg:w-[60%] min-w-0 lg:border-r border-[#E5E7EB] dark:border-gray-700 p-1.5 sm:p-2">
                        <div className="space-y-0.5 sm:space-y-1">
                          <div className="flex items-start">
                            <span className="text-[11px] text-[#2D3A4A] dark:text-gray-100 font-bold uppercase shrink-0 leading-[18px]">Tên tài khoản:</span>
                            <span style={{ fontFamily: '"Segoe UI Emoji"' }} className="text-[11px] text-[#2D3A4A] dark:text-gray-100 min-w-0 truncate ml-2">{accountName || "—"}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[11px] text-[#2D3A4A] dark:text-gray-100 font-bold uppercase shrink-0 leading-[18px]">Ngân hàng:</span>
                            <span style={{ fontFamily: '"Segoe UI Emoji"' }} className="text-[11px] text-[#2D3A4A] dark:text-gray-100 min-w-0 truncate ml-2">
                              {selectedBank ? selectedBank.fullName : "—"}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[11px] text-[#2D3A4A] dark:text-gray-100 font-bold uppercase shrink-0 leading-[18px]">Số tài khoản:</span>
                            <span style={{ fontFamily: '"Segoe UI Emoji"' }} className="text-[11px] font-mono text-[#2D3A4A] dark:text-gray-100 truncate ml-2">{accountNumber || "—"}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-[11px] text-[#2D3A4A] dark:text-gray-100 font-bold uppercase shrink-0 leading-[18px]">Số tiền:</span>
                            <span style={{ fontFamily: '"Segoe UI Emoji"' }} className="text-[11px] text-[#2D3A4A] dark:text-gray-100 truncate ml-2">{amount ? `${displayAmount(amount)} VNĐ` : "— VNĐ"}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[11px] text-[#2D3A4A] dark:text-gray-100 font-bold uppercase shrink-0 leading-[18px]">Nội dung:</span>
                            <span style={{ fontFamily: '"Segoe UI Emoji"' }} className="text-[11px] text-[#2D3A4A] dark:text-gray-100 truncate ml-2">{message || "—"}</span>
                          </div>
                          <div>
                            <BankAccountsDialog
                              currentBankCode={bankCode}
                              currentAccountNumber={accountNumber}
                              currentAccountName={accountName}
                              onCopy={onCopy}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-[40%] px-0 py-0 flex flex-col items-center justify-center">
                        <div className="mx-auto flex max-w-[140px] flex-col items-center">
                          <div className="relative w-full">
                            <img src="/qr-frame.png" alt="QR Frame" className="w-full h-auto object-contain" />
                            <div className="absolute left-0 right-0 top-[22%] flex items-center justify-center">
                              <QRCodeSVG
                                value={useLocalQR ? qrValue : (qrData || qrValue)}
                                size={80}
                                level="H"
                                fgColor="#000000"
                                bgColor="#ffffff"
                                className="object-contain"
                                includeMargin={false}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}