import { describe, it, expect } from "vitest";
import { createVietQRRequest, buildLocalQRPayload } from "./vietqr";

describe("createVietQRRequest", () => {
  it("tạo request đúng định dạng", () => {
    const result = createVietQRRequest("970422", "123456789", "NGUYEN VAN A", "500000", "Thanh toan");

    expect(result.accountNo).toBe("123456789");
    expect(result.accountName).toBe("NGUYEN VAN A");
    expect(result.acqId).toBe("970422");
    expect(result.amount).toBe("");
    expect(result.addInfo).toBe("");
    expect(result.format).toBe("text");
    expect(result.template).toBe("compact");
  });

  it("không required amount và message", () => {
    const result = createVietQRRequest("970422", "123456789", "NGUYEN VAN A");

    expect(result.accountNo).toBe("123456789");
    expect(result.amount).toBe("");
    expect(result.addInfo).toBe("");
  });

  it("chuyển tên thành chữ hoa không dấu", () => {
    const result = createVietQRRequest("970422", "123456789", "Nguyễn Văn A");

    expect(result.accountName).toBe("NGUYEN VAN A");
  });
});

describe("buildLocalQRPayload", () => {
  it("ghép payload theo định dạng bank|acc|tên|số tiền|nội dung", () => {
    expect(buildLocalQRPayload("970422", "123456789", "Nguyen Van A", "500000", "Thanh toan"))
      .toBe("970422|123456789|NGUYEN VAN A|500000|Thanh toan");
  });

  it("mặc định số tiền 0 và nội dung rỗng khi không truyền", () => {
    expect(buildLocalQRPayload("970422", "123456789", "Nguyen Van A"))
      .toBe("970422|123456789|NGUYEN VAN A|0|");
  });

  it("gộp khoảng trắng thừa trong tên và nội dung", () => {
    expect(buildLocalQRPayload("970422", "1", "  Nguyen   Van  A  ", "", "  Thanh   toan "))
      .toBe("970422|1|NGUYEN VAN A|0|Thanh toan");
  });
});
