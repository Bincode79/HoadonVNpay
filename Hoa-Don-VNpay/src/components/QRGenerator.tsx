import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Printer, RotateCcw } from "lucide-react";
import { QRForm } from "@/components/QRForm";
import { QRResult } from "@/components/QRResult";
import { BrandStrip, StatusBar, TopBar } from "@/components/VnpayShell";
import { createVietQRRequest, generateVietQR, buildLocalQRPayload } from "@/services/vietqr";

export default function QRGenerator() {
  const [searchParams] = useSearchParams();
  const [bankCode, setBankCode] = useState(searchParams.get("bank") || "");
  const [accountNumber, setAccountNumber] = useState(searchParams.get("acc") || "");
  const [accountName, setAccountName] = useState(searchParams.get("name") || "");
  const [amount, setAmount] = useState(searchParams.get("amount") || "");
  const [message, setMessage] = useState(searchParams.get("msg") || "");
  const [generated, setGenerated] = useState(!!searchParams.get("bank") && !!searchParams.get("acc"));
  const [useLocalQR, setUseLocalQR] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [qrData, setQrData] = useState<string>("");

  const qrValue = useMemo(() => {
    if (!bankCode || !accountNumber) return "";
    return buildLocalQRPayload(bankCode, accountNumber, accountName, amount, message);
  }, [bankCode, accountNumber, accountName, amount, message]);

  const handleGenerate = useCallback(async () => {
    if (!bankCode || !accountNumber) {
      toast.error("Vui lòng chọn ngân hàng và nhập số tài khoản!");
      return;
    }

    setIsLoading(true);
    try {
      const request = createVietQRRequest(bankCode, accountNumber, accountName, amount || undefined, message || undefined);
      const response = await generateVietQR(request);

      if (response.code === "00" && response.data?.qrCode) {
        setQrData(response.data.qrCode);
        setUseLocalQR(false);
        toast.success("Đã tạo mã QR thành công!");
      } else {
        toast.error(response.desc || "Không thể tạo mã QR");
        setUseLocalQR(true);
        setQrData(qrValue);
      }
    } catch {
      toast.error("Lỗi kết nối API, sử dụng QR cục bộ");
      setUseLocalQR(true);
      setQrData(qrValue);
    } finally {
      setIsLoading(false);
      setGenerated(true);
    }
  }, [bankCode, accountNumber, accountName, amount, message, qrValue]);

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Đã sao chép!");
  }, []);

  const handleReset = useCallback(() => {
    setGenerated(false);
    setBankCode("");
    setAccountNumber("");
    setAccountName("");
    setAmount("");
    setMessage("");
    setQrData("");
    setUseLocalQR(true);
  }, []);

  useEffect(() => {
    if (searchParams.get("bank") && searchParams.get("acc")) {
      handleGenerate();
    }
  }, [searchParams, handleGenerate]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="flex h-screen max-h-screen flex-col overflow-hidden bg-background">
      <TopBar merchantName="HoadonVNpay" showTimer={generated} />
      {/* Panels and the brand strip form ONE centred group, so the strip sits
          tight under the panels instead of being pushed to the page bottom. */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden py-4">
        <div className="w-full px-4">
          {generated ? (
            <QRResult
              bankCode={bankCode}
              accountNumber={accountNumber}
              accountName={accountName}
              amount={amount}
              message={message}
              qrValue={qrValue}
              qrData={qrData}
              useLocalQR={useLocalQR}
              isLoading={isLoading}
              onCopy={handleCopy}
            />
          ) : (
            <QRForm
              bankCode={bankCode}
              setBankCode={setBankCode}
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              accountName={accountName}
              setAccountName={setAccountName}
              amount={amount}
              setAmount={setAmount}
              message={message}
              setMessage={setMessage}
              isLoading={isLoading}
              onGenerate={handleGenerate}
              qrValue={qrValue}
            />
          )}
        </div>
        <div className="no-print w-full shrink-0 px-4">
          <BrandStrip />
        </div>
      </div>
      <StatusBar
        actions={
          generated ? (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="vv-btn-ghost-sm flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} /> Tạo hóa đơn mới
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="vv-btn-sub-sm flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" strokeWidth={1.75} /> In hóa đơn
              </button>
            </>
          ) : null
        }
      />
    </div>
  );
}