import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { convertCurrency } from "@/actions/convert";
import CurrencyConverter from "./CurrencyConverter";

vi.mock("@/actions/convert", () => ({
  convertCurrency: vi.fn(),
}));

const currencies = [
  { short_code: "USD", name: "US Dollar" },
  { short_code: "GBP", name: "British Pound" },
];

describe("CurrencyConverter", () => {
  beforeEach(() => {
    vi.mocked(convertCurrency).mockReset();
  });

  it("converts the amount and adds it to previous conversions", async () => {
    vi.mocked(convertCurrency).mockResolvedValue({
      result: { from: "USD", to: "GBP", amount: 10, converted_amount: 7.4567 },
    });
    const user = userEvent.setup();

    render(<CurrencyConverter currencies={currencies} />);

    const [fromSelect, toSelect] = screen.getAllByRole("combobox");
    await user.selectOptions(fromSelect, "USD");
    await user.selectOptions(toSelect, "GBP");
    await user.type(screen.getAllByRole("spinbutton")[0], "10");
    await user.click(screen.getByRole("button", { name: "Convert" }));

    expect(await screen.findByDisplayValue("7.46")).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveTextContent(
      "10 USD = 7.46 GBP",
    );

    const formData = vi.mocked(convertCurrency).mock.calls[0][1];
    expect(formData.get("from")).toBe("USD");
    expect(formData.get("to")).toBe("GBP");
    expect(formData.get("amount")).toBe("10");
  });

  it("shows the error returned by the conversion", async () => {
    vi.mocked(convertCurrency).mockResolvedValue({
      error: "Please pick both currencies and enter an amount.",
    });
    const user = userEvent.setup();

    render(<CurrencyConverter currencies={currencies} />);

    await user.click(screen.getByRole("button", { name: "Convert" }));

    expect(
      await screen.findByText(
        "Error: Please pick both currencies and enter an amount.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No previous conversions available."),
    ).toBeInTheDocument();
  });
});
