import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PreviousConversions from "./PreviousConversions";

describe("PreviousConversions", () => {
  it("shows an empty message when there are no conversions", () => {
    render(<PreviousConversions conversions={[]} />);

    expect(
      screen.getByText("No previous conversions available."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("lists each conversion with the converted amount to 2 decimal places", () => {
    render(
      <PreviousConversions
        conversions={[
          { from: "USD", to: "GBP", amount: 10, converted_amount: 7.4567 },
          { from: "EUR", to: "JPY", amount: 5, converted_amount: 812.1 },
        ]}
      />,
    );

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("10 USD = 7.46 GBP");
    expect(items[1]).toHaveTextContent("5 EUR = 812.10 JPY");
  });
});
