import { codnovTheme, codnovDarkTheme, productColors } from "../../lib/theme";

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

  it("provides a Linear dark variant for native apps with shared indigo primary", () => {
    expect(codnovDarkTheme.primary).toBe("#5e6ad2");
    expect(codnovDarkTheme.background).toBe("#08090a");
    expect(codnovDarkTheme.text).toBe("#f7f8f8");
    expect(codnovDarkTheme.card).toBe("#1a1b1e");
  });
});
