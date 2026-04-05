import { egpnTheme, productColors } from "../../lib/theme";

describe("Wise / EGPN theme tokens", () => {
  it("uses Wise bright blue for primary and EGPN product key", () => {
    expect(egpnTheme.primary).toBe("#00b9ff");
    expect(productColors.egpn).toBe("#00b9ff");
  });

  it("uses Wise dark green as success accent", () => {
    expect(egpnTheme.success).toBe("#163300");
  });

  it("uses Wise white canvas", () => {
    expect(egpnTheme.background).toBe("#ffffff");
    expect(egpnTheme.text).toBe("#0e1011");
  });
});
