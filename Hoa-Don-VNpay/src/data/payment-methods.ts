export interface PaymentMethod {
  id: string;
  label: string;
  note: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "atm", label: "Thẻ ATM/Tài khoản ngân hàng", note: "Phí giao dịch 1,2%" },
  { id: "atm-vnpay", label: "Thẻ ATM nội địa qua VNPAY", note: "Phí giao dịch 1%" },
  { id: "credit-onepay", label: "Thẻ tín dụng qua OnePay", note: "Phí giao dịch 3.4%" },
  { id: "credit-vnpay", label: "Thẻ tín dụng qua VNPAY", note: "Phí giao dịch 2.5%" },
  { id: "transfer", label: "Chuyển khoản", note: "Miễn phí giao dịch" },
];