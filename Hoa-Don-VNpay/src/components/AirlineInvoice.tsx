import { QRCodeSVG } from "qrcode.react";
import { Check, Plane, Calendar, Clock, MapPin, CreditCard, User, Shield, RotateCcw, Download } from "lucide-react";
import { BANKS } from "@/data/banks";
import { displayAmount, generateBookingCode } from "@/lib/string-utils";
import { BankAccountsDialog } from "@/components/BankAccountsDialog";
import caavLogo from "@/assets/caav-logo.svg";

interface AirlineInvoiceProps {
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
  onReset: () => void;
  passengerName?: string;
  passengerId?: string;
  passengerPhone?: string;
  passengerEmail?: string;
  flightNumber?: string;
  route?: string;
  flightDate?: string;
  flightTime?: string;
  seatClass?: string;
  bookingCode?: string;
  ticketQuantity?: string;
  unitPrice?: string;
}

export function AirlineInvoice({
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
  onReset,
  passengerName = "",
  passengerId = "",
  passengerPhone = "",
  passengerEmail = "",
  flightNumber = "",
  route = "",
  flightDate = "",
  flightTime = "",
  seatClass = "Economy",
  bookingCode = "",
  ticketQuantity = "1",
  unitPrice = "",
}: AirlineInvoiceProps) {
  const selectedBank = BANKS.find((b) => b.code === bankCode);
  const displayBookingCode = bookingCode || generateBookingCode();

  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) return "—";
    return timeStr;
  };

  const qty = parseInt(ticketQuantity, 10) || 1;
  const calcUnitPrice = unitPrice || (amount && qty > 0 ? String(Math.round(Number(amount) / qty)) : "");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E8EDF4] to-[#F5F6FA] dark:from-gray-900 dark:to-gray-900 items-center py-4 px-3 sm:px-4">
      <div className="w-full max-w-3xl">
        {/* Main Invoice Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[20px] border border-[#DCE6F2] dark:border-gray-700 overflow-hidden shadow-[0_20px_40px_-20px_rgba(15,35,65,0.35)]">
          
          {/* Header - Airline Branding */}
          <div className="bg-gradient-to-r from-[#003366] via-[#004080] to-[#003366] p-4 sm:p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/qr-frame.png')] opacity-5" />
            <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <img src={caavLogo} alt="CAAV" className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg sm:text-xl tracking-wide">CỔNG THANH TOÁN TRỰC TUYẾN</h1>
                  <p className="text-[#FFD700] text-sm sm:text-base font-medium tracking-wider uppercase">TRUNG TÂM HÀNG KHÔNG VIỆT NAM</p>
                  <p className="text-white/70 text-xs sm:text-sm">CIVIL AVIATION AUTHORITY OF VIETNAM</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white/50 text-xs uppercase tracking-wider">Mã giao dịch / Booking Ref</p>
                <p className="text-white font-mono text-lg sm:text-xl font-bold tracking-widest">{displayBookingCode}</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500]" />
          </div>

          {/* Passenger Info Section */}
          {(passengerName || passengerId || passengerPhone || passengerEmail) && (
            <div className="p-4 sm:p-5 border-b border-[#E5E7EB] dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2 text-[#003366] font-semibold text-sm sm:text-base mb-3">
                <User className="w-5 h-5" />
                <span>THÔNG TIN HÀNH KHÁCH / PASSENGER INFORMATION</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide">Họ tên</span>
                  <span className="text-[#2D3A4A] dark:text-gray-100 font-medium">{passengerName || "—"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide">CMND/CCCD</span>
                  <span className="text-[#2D3A4A] dark:text-gray-100 font-mono">{passengerId || "—"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide">Điện thoại</span>
                  <span className="text-[#2D3A4A] dark:text-gray-100">{passengerPhone || "—"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide">Email</span>
                  <span className="text-[#2D3A4A] dark:text-gray-100 truncate">{passengerEmail || "—"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Flight Info Section */}
          {(flightNumber || route || flightDate || flightTime) && (
            <div className="p-4 sm:p-5 border-b border-[#E5E7EB] dark:border-gray-700">
              <div className="flex items-center gap-2 text-[#003366] font-semibold text-sm sm:text-base mb-3">
                <Plane className="w-5 h-5" />
                <span>THÔNG TIN CHUYẾN BAY / FLIGHT INFORMATION</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide">Chuyến bay</span>
                  <span className="text-[#2D3A4A] dark:text-gray-100 font-bold text-lg">{flightNumber || "—"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide">Tuyến bay</span>
                  <span className="text-[#2D3A4A] dark:text-gray-100 font-medium">{route || "—"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide">Ngày bay</span>
                  <span className="text-[#2D3A4A] dark:text-gray-100 font-medium">{formatDisplayDate(flightDate)}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide">Giờ bay</span>
                  <span className="text-[#2D3A4A] dark:text-gray-100 font-medium">{formatDisplayTime(flightTime)}</span>
                </div>
              </div>
              {seatClass && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-[#003366]/10 text-[#003366] dark:text-[#FFD700] rounded-full text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  <span>Hạng: {seatClass}</span>
                </div>
              )}
            </div>
          )}

          {/* Ticket Quantity & Summary Section */}
          <div className="p-4 sm:p-5 border-b border-[#E5E7EB] dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2 text-[#003366] font-semibold text-sm sm:text-base mb-3">
              <Calendar className="w-5 h-5" />
              <span>THÔNG TIN VÉ / TICKET QUANTITY</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex flex-col gap-0.5">
                <span className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide">Số lượng vé (Quantity)</span>
                <span className="text-[#2D3A4A] dark:text-gray-100 font-bold text-lg">{qty} vé</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide">Đơn giá / Unit Price</span>
                <span className="text-[#2D3A4A] dark:text-gray-100 font-medium">{calcUnitPrice ? `${displayAmount(calcUnitPrice)} VNĐ` : "— VNĐ"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide">Tổng tiền / Total Amount</span>
                <span className="text-[#003366] dark:text-[#FFD700] font-bold text-lg">{amount ? `${displayAmount(amount)} VNĐ` : "— VNĐ"}</span>
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[#003366] font-semibold text-sm sm:text-base mb-4">
              <CreditCard className="w-5 h-5" />
              <span>CHI TIẾT THANH TOÁN / PAYMENT DETAILS</span>
            </div>

            {/* Payment Method */}
            <div className="mb-4 p-3 bg-[#003366]/5 dark:bg-blue-900/20 rounded-lg border border-[#003366]/20 dark:border-blue-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#003366] dark:bg-blue-600 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[#003366] dark:text-blue-300 font-semibold">THANH TOÁN QR PAY / HÓA ĐƠN</p>
                  <p className="text-[#5A6A7A] dark:text-gray-400 text-sm">{amount ? `${displayAmount(amount)} VNĐ` : "— VNĐ"} • {selectedBank?.fullName || bankCode} • STK: {accountNumber}</p>
                </div>
              </div>
            </div>

            {/* Bank Account Details */}
            <div className="space-y-3 mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#E5E7EB] dark:border-gray-700 p-4">
                <div className="flex items-start gap-3">
                  {selectedBank && (
                    <img src={selectedBank.logo} alt={selectedBank.name} className="w-14 h-14 object-contain flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#5A6A7A] dark:text-gray-400 text-xs uppercase tracking-wide mb-1">Ngân hàng thụ hưởng</p>
                    <p className="text-[#2D3A4A] dark:text-gray-100 font-semibold text-lg">{selectedBank?.fullName || "—"}</p>
                    <p className="text-[#5A6A7A] dark:text-gray-400 text-sm mt-1">Mã ngân hàng: {bankCode || "—"}</p>
                    <p className="text-[#5A6A7A] dark:text-gray-400 text-sm">Số tài khoản: {accountNumber || "—"}</p>
                    <p className="text-[#5A6A7A] dark:text-gray-400 text-sm">Tên tài khoản: {accountName || "—"}</p>
                    <p className="text-[#003366] dark:text-[#FFD700] font-bold text-sm mt-2">Số tiền: {amount ? `${displayAmount(amount)} VNĐ` : "— VNĐ"}</p>
                    <p className="text-[#5A6A7A] dark:text-gray-400 text-sm">Nội dung: {message || "Thanh toan dich vu hang khong"}</p>
                  </div>
                </div>
              </div>

              <div>
                <BankAccountsDialog
                  currentBankCode={bankCode}
                  currentAccountNumber={accountNumber}
                  currentAccountName={accountName}
                />
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mt-6 pt-6 border-t border-[#E5E7EB] dark:border-gray-700">
              <div className="flex items-center gap-2 text-[#5A6A7A] dark:text-gray-400 text-sm font-medium mb-4">
                <MapPin className="w-4 h-4" />
                <span>QUÉT MÃ QR ĐỂ THANH TOÁN / SCAN TO PAY</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-full max-w-[280px]">
                  <img src="/qr-frame.png" alt="QR Frame" className="w-full h-auto object-contain" />
                  <div className="absolute left-0 right-0 top-[18%] bottom-[18%] flex items-center justify-center px-4">
                    <QRCodeSVG
                      value={useLocalQR ? qrValue : (qrData || qrValue)}
                      size={qrSize || 200}
                      level="H"
                      fgColor="#000000"
                      bgColor="#ffffff"
                      includeMargin={false}
                    />
                  </div>
                </div>
                <div className="text-center text-xs text-[#5A6A7A] dark:text-gray-400 px-4">
                  <p className="font-medium text-[#2D3A4A] dark:text-gray-200">Mã QR VietQR / VNPAY</p>
                  <p>Quét bằng ứng dụng ngân hàng hoặc VNPAY/VietQR</p>
                  <p className="mt-1 font-mono text-[#003366] dark:text-[#FFD700]">{displayBookingCode}</p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-6 p-4 bg-[#FFF8E1] dark:bg-yellow-900/20 border border-[#FFD700]/30 dark:border-yellow-800/30 rounded-lg">
              <p className="text-[#8D6E00] dark:text-yellow-300 font-semibold text-sm flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4" />
                LƯU Ý QUAN TRỌNG / IMPORTANT NOTES
              </p>
              <ul className="text-[#8D6E00] dark:text-yellow-200 text-sm space-y-1 pl-4 list-disc">
                <li>Vui lòng thanh toán đúng số tiền và nội dung như trên hóa đơn</li>
                <li>Mã QR có hiệu lực trong 24h từ lúc tạo</li>
                <li>Sau khi thanh toán, vui lòng giữ lại biên lai làm chứng từ</li>
                <li>Thắc mắc liên hệ: 1900-xxxx hoặc email: support@caav.gov.vn</li>
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-[#E5E7EB] dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-[#5A6A7A] dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Tạo lúc: {new Date().toLocaleString("vi-VN")}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Bảo mật SSL 256-bit
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#003366] hover:bg-[#004080] rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                In / Lưu PDF
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium text-[#003366] dark:text-[#FFD700] hover:bg-[#003366]/10 dark:hover:bg-yellow-600/10 rounded-lg transition-colors border border-[#003366]/30 dark:border-yellow-600/30"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Tạo mới / New Payment
              </button>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="text-center mt-4 text-xs text-[#5A6A7A] dark:text-gray-500 uppercase tracking-wider">
          Trung Tâm Hàng Không Việt Nam - Civil Aviation Authority of Vietnam
        </div>
      </div>
    </div>
  );
}