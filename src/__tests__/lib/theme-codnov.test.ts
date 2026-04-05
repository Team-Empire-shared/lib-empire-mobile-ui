import { codnovTheme, productColors } from "../../lib/theme";

describe("Linear / Codnov theme tokens", () => {
  it("uses Linear indigo for primary and Codnov product key", () => {
    expect(codnovTheme.primary).toBe("#5e6ad2");
    expect(productColors.codnov).toBe("#5e6ad2");
  });

  it("uses Linear light canvas with near-black ink", () => {
    expect(codnovTheme.background).toBe("#ffffff");
    expect(codnovTheme.text).toBe("#0c0d10");
  });

  it("uses Linear hairline border", () => {
    expect(codnovTheme.border).toBe("#e6e6e8");
  });
});
